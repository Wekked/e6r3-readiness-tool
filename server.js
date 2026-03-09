import express from 'express';
import cors from 'cors';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = join(__dirname, '.env');
let apiKey = null;
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, 'utf8');
  apiKey = envFile.match(/ANTHROPIC_API_KEY=(.*)/)?.[1]?.trim();
}
if (!apiKey) apiKey = process.env.ANTHROPIC_API_KEY;
console.log('API key loaded:', apiKey ? 'yes' : 'NO');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

function safeDecode(str) {
  try { return decodeURIComponent(str); }
  catch { return str; }
}

async function extractPdfText(buffer) {
  const { default: PDFParser } = await import('pdf2json');
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();
    parser.on('pdfParser_dataReady', (data) => {
      const text = data.Pages.map(page =>
        page.Texts.map(t => t.R.map(r => safeDecode(r.T)).join('')).join(' ')
      ).join('\n\n');
      resolve({ text, pages: data.Pages.length });
    });
    parser.on('pdfParser_dataError', (err) => reject(err));
    parser.parseBuffer(buffer);
  });
}

app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const name = file.originalname.toLowerCase();
    let text = '';

    if (name.endsWith('.txt')) {
      text = file.buffer.toString('utf8');
    } else if (name.endsWith('.pdf')) {
      console.log('Extracting PDF:', file.originalname, '(' + (file.size / 1024).toFixed(0) + ' KB)');
      const result = await extractPdfText(file.buffer);
      text = result.text;
      console.log('PDF extracted:', result.pages, 'pages,', text.length, 'chars');
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
      console.log('DOCX extracted:', text.length, 'chars');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' });
    }

    const MAX_CHARS = 80000;
    if (text.length > MAX_CHARS) {
      console.log('Truncating from', text.length, 'to', MAX_CHARS, 'chars');
      text = text.substring(0, MAX_CHARS) + '\n\n[... document truncated due to length ...]';
    }

    res.json({ text, charCount: text.length, fileName: file.originalname });
  } catch (err) {
    console.error('Extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract text: ' + err.message });
  }
});

app.post('/api/analyze', async (req, res) => {
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  console.log('--- ANALYZE REQUEST ---');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: req.body.model || 'claude-sonnet-4-20250514',
        max_tokens: req.body.max_tokens || 8000,
        system: req.body.system || undefined,
        messages: req.body.messages
      })
    });

    const data = await response.json();
    console.log('Anthropic status:', response.status);
    if (!response.ok) {
      console.log('Anthropic error:', JSON.stringify(data.error));
      return res.status(response.status).json({ error: data.error?.message });
    }
    res.json(data);
  } catch (err) {
    console.log('Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend from dist/ (production build)
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{0,}', (req, res) => res.sendFile(join(distPath, 'index.html')));
  console.log('Serving frontend from dist/');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
