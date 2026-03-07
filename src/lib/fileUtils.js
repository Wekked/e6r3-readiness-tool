const EXTRACT_URL = 'http://localhost:3001/api/extract';

/**
 * Read a file and extract its text content.
 * PDFs and DOCX files are sent to the server for extraction.
 * TXT files are read directly in the browser.
 *
 * @param {File} file
 * @returns {Promise<{text: string, isBase64: boolean, charCount: number}>}
 */
export async function readFileContent(file) {
  // TXT files — read directly
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const text = await file.text();
    return { text, isBase64: false, charCount: text.length };
  }

  // PDF and DOCX — send to server for text extraction
  console.log(`[E6R3] Extracting text from ${file.name} (${(file.size / 1024).toFixed(0)} KB)...`);

  const formData = new FormData();
  formData.append('file', file);

  const resp = await fetch(EXTRACT_URL, {
    method: 'POST',
    body: formData
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    throw new Error(err?.error || `Text extraction failed: ${resp.status}`);
  }

  const data = await resp.json();
  console.log(`[E6R3] Extracted ${data.charCount} characters from ${file.name}`);

  return { text: data.text, isBase64: false, charCount: data.charCount };
}
