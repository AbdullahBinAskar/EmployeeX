import Anthropic from '@anthropic-ai/sdk';

let client;

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function callClaude(messages, systemPrompt, maxTokens = 1500) {
  try {
    const anthropic = getClient();
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    });

    return response.content?.map(b => b.text || '').join('\n') || 'No response.';
  } catch (err) {
    console.error('Claude API error:', err.message);
    return `AI Error: ${err.message}`;
  }
}
