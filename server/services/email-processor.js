import getDb from '../db/database.js';
import { analyzeEmail } from './email-analyzer.js';

function extractEmails(str) {
  if (!str) return [];
  const matches = str.match(/[\w.-]+@[\w.-]+\.\w+/g);
  return (matches || []).map(e => e.toLowerCase());
}

function linkEmailToEmployees(emailId, from, to, cc) {
  const db = getDb();
  const employees = db.prepare('SELECT id, email FROM employees WHERE email IS NOT NULL').all();
  const empByEmail = {};
  for (const emp of employees) {
    if (emp.email) empByEmail[emp.email.toLowerCase()] = emp.id;
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO email_employee_links (email_id, employee_id, role)
    VALUES (?, ?, ?)
  `);

  const linkAll = (addresses, role) => {
    for (const addr of addresses) {
      const empId = empByEmail[addr];
      if (empId) {
        insert.run(emailId, empId, role);
        console.log(`[Processor]   -> Linked email #${emailId} to employee #${empId} (${role})`);
      }
    }
  };

  linkAll(extractEmails(from), 'from');
  linkAll(extractEmails(to), 'to');
  linkAll(extractEmails(cc), 'cc');
}

function extractProjectTag(subject) {
  const match = subject?.match(/\[PRJ-(\d+)\]/i);
  return match ? parseInt(match[1], 10) : null;
}

function matchSenderToEmployee(fromAddress) {
  if (!fromAddress) return null;
  const db = getDb();
  // Extract email from "Name <email>" format
  const emailMatch = fromAddress.match(/<([^>]+)>/) || [null, fromAddress];
  const email = (emailMatch[1] || '').toLowerCase().trim();
  if (!email) return null;
  const emp = db.prepare('SELECT id FROM employees WHERE LOWER(email) = ?').get(email);
  return emp?.id || null;
}

function isDuplicate(messageId) {
  if (!messageId) return false;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM emails WHERE gmail_message_id = ?').get(messageId);
  return !!existing;
}

async function executeAction(action, emailId, projectId) {
  const db = getDb();
  const type = action.type;
  const d = action.data || {};

  try {
    switch (type) {
      case 'create_meeting': {
        const result = db.prepare(`
          INSERT INTO meetings (title, date, time, duration_minutes, project_id, summary, status)
          VALUES (?, ?, ?, ?, ?, ?, 'scheduled')
        `).run(
          d.title || 'Meeting from email',
          d.date || new Date().toISOString().split('T')[0],
          d.time || '09:00',
          d.duration_minutes || 60,
          d.project_id || projectId,
          d.summary || ''
        );
        console.log(`[Processor]   -> Created meeting #${result.lastInsertRowid}: "${d.title}"`);
        return { type, id: result.lastInsertRowid, success: true };
      }

      case 'create_deliverable': {
        const result = db.prepare(`
          INSERT INTO deliverables (title, project_id, assignee_id, priority, due_date, description, status)
          VALUES (?, ?, ?, ?, ?, ?, 'not_started')
        `).run(
          d.title || 'Task from email',
          d.project_id || projectId,
          d.assignee_id || null,
          d.priority || 'medium',
          d.due_date || null,
          d.description || ''
        );
        console.log(`[Processor]   -> Created deliverable #${result.lastInsertRowid}: "${d.title}"`);
        return { type, id: result.lastInsertRowid, success: true };
      }

      case 'update_deliverable': {
        if (!d.deliverable_id) return { type, success: false, error: 'No deliverable_id' };
        db.prepare(`
          UPDATE deliverables SET
            status = COALESCE(?, status),
            notes = COALESCE(?, notes)
          WHERE id = ?
        `).run(d.status || null, d.notes || null, d.deliverable_id);
        console.log(`[Processor]   -> Updated deliverable #${d.deliverable_id}`);
        return { type, id: d.deliverable_id, success: true };
      }

      case 'update_milestone': {
        if (!d.milestone_id) return { type, success: false, error: 'No milestone_id' };
        db.prepare(`
          UPDATE milestones SET
            status = COALESCE(?, status),
            notes = COALESCE(?, notes)
          WHERE id = ?
        `).run(d.status || null, d.notes || null, d.milestone_id);
        console.log(`[Processor]   -> Updated milestone #${d.milestone_id}`);
        return { type, id: d.milestone_id, success: true };
      }

      case 'update_project_progress': {
        const pid = d.project_id || projectId;
        if (!pid) return { type, success: false, error: 'No project_id' };
        db.prepare(`
          UPDATE projects SET
            progress = COALESCE(?, progress),
            health = COALESCE(?, health)
          WHERE id = ?
        `).run(d.progress ?? null, d.health || null, pid);
        console.log(`[Processor]   -> Updated project #${pid} progress: ${d.progress}%`);
        return { type, id: pid, success: true };
      }

      case 'flag_risk': {
        // Store risk as a note on the project
        const rpid = d.project_id || projectId;
        if (rpid) {
          db.prepare(`UPDATE projects SET health = 'red' WHERE id = ?`).run(rpid);
          console.log(`[Processor]   -> Flagged risk on project #${rpid}: ${d.description}`);
        }
        return { type, project_id: rpid, success: true };
      }

      default:
        console.log(`[Processor]   -> Unknown action type: ${type}`);
        return { type, success: false, error: 'Unknown action type' };
    }
  } catch (err) {
    console.error(`[Processor]   -> Action ${type} failed:`, err.message);
    return { type, success: false, error: err.message };
  }
}

export async function processEmail(parsed) {
  const db = getDb();

  const messageId = parsed.messageId || null;
  const from = parsed.from?.text || parsed.from?.value?.[0]?.address || 'unknown';
  const to = parsed.to?.text || parsed.to?.value?.[0]?.address || '';
  const cc = parsed.cc?.text || '';
  const subject = parsed.subject || '(No Subject)';
  const body = parsed.text || parsed.html?.replace(/<[^>]+>/g, ' ').substring(0, 5000) || '';
  const date = parsed.date ? parsed.date.toISOString() : new Date().toISOString();
  const hasAttachment = (parsed.attachments?.length > 0) ? 1 : 0;

  console.log(`[Processor] Processing email: "${subject}" from ${from}`);

  // Dedup check
  if (isDuplicate(messageId)) {
    console.log(`[Processor] Skipping duplicate: ${messageId}`);
    db.prepare(`
      INSERT INTO email_processing_log (gmail_message_id, status, error_message)
      VALUES (?, 'skipped', 'Duplicate gmail_message_id')
    `).run(messageId);
    return;
  }

  // Extract project tag from subject
  const tagProjectId = extractProjectTag(subject);

  // Match sender to employee
  const employeeId = matchSenderToEmployee(from);

  // AI analysis
  const analysis = await analyzeEmail({
    from, to, subject, body, date,
  });

  // Determine project_id: subject tag > AI inference
  const projectId = tagProjectId || analysis.project_id || null;
  const finalEmployeeId = employeeId || analysis.employee_id || null;

  // Insert email
  const emailResult = db.prepare(`
    INSERT INTO emails (gmail_message_id, from_address, to_address, cc, subject, body, date, classification, status, priority, project_id, employee_id, has_attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unread', ?, ?, ?, ?)
  `).run(
    messageId, from, to, cc, subject, body, date,
    analysis.classification, analysis.priority,
    projectId, finalEmployeeId, hasAttachment
  );

  const emailId = emailResult.lastInsertRowid;
  console.log(`[Processor] Inserted email #${emailId} — classification: ${analysis.classification}, project: ${projectId}`);

  // Link email to all employees found in from/to/cc
  linkEmailToEmployees(emailId, from, to, cc);

  // Execute actions
  const actionResults = [];
  for (const action of analysis.actions) {
    const result = await executeAction(action, emailId, projectId);
    actionResults.push(result);
  }

  // Log processing
  db.prepare(`
    INSERT INTO email_processing_log (gmail_message_id, email_id, ai_analysis, actions_taken, status)
    VALUES (?, ?, ?, ?, 'success')
  `).run(
    messageId,
    emailId,
    JSON.stringify(analysis),
    JSON.stringify(actionResults)
  );

  console.log(`[Processor] Done — ${actionResults.length} action(s) executed for email #${emailId}`);
}
