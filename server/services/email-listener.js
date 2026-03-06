import { ImapFlow } from 'imapflow';
import { processEmail } from './email-processor.js';
import { simpleParser } from 'mailparser';

let client = null;
let listening = false;
let reconnectTimer = null;
let reconnectDelay = 5000;
const MAX_RECONNECT_DELAY = 60000;

function getConfig() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return {
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
  };
}

async function connectAndListen() {
  const config = getConfig();
  if (!config) {
    console.log('[EmailListener] Gmail credentials not configured in .env — listener disabled.');
    return;
  }

  client = new ImapFlow(config);

  client.on('error', (err) => {
    console.error('[EmailListener] IMAP error:', err.message);
  });

  client.on('close', () => {
    console.log('[EmailListener] Connection closed.');
    listening = false;
    scheduleReconnect();
  });

  try {
    await client.connect();
    console.log(`[EmailListener] Connected to Gmail IMAP as ${config.auth.user}`);
    reconnectDelay = 5000; // reset on success

    const lock = await client.getMailboxLock('INBOX');
    try {
      // Capture current highest UID as baseline — skip existing emails
      const status = await client.status('INBOX', { uidNext: true });
      const baselineUid = status.uidNext ? status.uidNext - 1 : 0;
      console.log(`[EmailListener] Baseline UID: ${baselineUid} — only processing newer emails.`);

      listening = true;

      // Listen for new emails via EXISTS event
      client.on('exists', async (data) => {
        try {
          // Fetch messages newer than baseline
          const range = `${baselineUid + 1}:*`;
          for await (const msg of client.fetch(range, { source: true, uid: true })) {
            if (msg.uid <= baselineUid) continue;
            console.log(`[EmailListener] New email detected — UID ${msg.uid}`);
            try {
              const parsed = await simpleParser(msg.source);
              await processEmail(parsed);
            } catch (parseErr) {
              console.error(`[EmailListener] Failed to process UID ${msg.uid}:`, parseErr.message);
            }
          }
        } catch (fetchErr) {
          console.error('[EmailListener] Fetch error:', fetchErr.message);
        }
      });

      // IDLE to keep connection alive and detect new messages
      while (listening && client.usable) {
        try {
          await client.idle();
        } catch (idleErr) {
          if (listening) {
            console.error('[EmailListener] IDLE error:', idleErr.message);
          }
          break;
        }
      }
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error('[EmailListener] Connection failed:', err.message);
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  console.log(`[EmailListener] Reconnecting in ${reconnectDelay / 1000}s...`);
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
    await connectAndListen();
  }, reconnectDelay);
}

export async function startEmailListener() {
  if (listening) return;
  connectAndListen().catch((err) => {
    console.error('[EmailListener] Startup error:', err.message);
  });
}

export async function stopEmailListener() {
  listening = false;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (client && client.usable) {
    try {
      await client.logout();
    } catch {
      // ignore
    }
  }
  client = null;
  console.log('[EmailListener] Stopped.');
}

export function getListenerStatus() {
  return {
    running: listening,
    connected: client?.usable || false,
    user: process.env.GMAIL_USER || null,
  };
}
