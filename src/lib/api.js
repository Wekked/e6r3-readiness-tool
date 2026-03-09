import { SYSTEM_PROMPT } from './prompts';

// API endpoint — Express server running locally
const API_URL = 'http://localhost:3001/api/analyze';

/**
 * Call the API server to proxy to Anthropic
 * @param {string} systemExtra - Additional system prompt context
 * @param {Array} userContent - Message content array
 * @returns {Object} Parsed JSON response
 */
export async function callAPI(systemExtra, userContent) {
  console.log('[E6R3] Calling API...');
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: SYSTEM_PROMPT + (systemExtra ? '\n\n' + systemExtra : ''),
      messages: [{ role: 'user', content: userContent }]
    })
  });

  console.log('[E6R3] Response status:', resp.status);

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    console.error('[E6R3] API error:', err);
    throw new Error(err?.error || `API error: ${resp.status}`);
  }

  const data = await resp.json();
  const text = data.content
    .map((i) => i.text || '')
    .join('\n')
    .replace(/```json|```/g, '')
    .trim();

  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

/**
 * Build message content parts from a document object.
 * All files are now pre-extracted to text by the server.
 */
export function buildDocContent(doc) {
  const parts = [];
  if (doc.fileData?.text) {
    parts.push({
      type: 'text',
      text: `--- ${doc.fileName} (${doc.typeLabel}) ---\n${doc.fileData.text}\n--- END ---`
    });
  }
  return parts;
}
