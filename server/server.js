import express from 'express';
import cors from 'cors';
import multer from 'multer';
import unzipper from 'unzipper';
import { XMLParser } from 'fast-xml-parser';
import textract from 'textract';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  storage: multer.memoryStorage()
});

// Utility: extract text content (<a:t>) from PPTX slide XML
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

async function extractTextFromPptxBuffer(buffer) {
  const texts = [];

  // Unzip pptx (it's just a zip)
  const directory = await unzipper.Open.buffer(buffer);

  // Slides (ppt/slides/slideN.xml), Notes (ppt/notesSlides/notesSlideN.xml)
  const slideFiles = directory.files.filter(f =>
    /^ppt\/(slides\/slide\d+\.xml|notesSlides\/notesSlide\d+\.xml)$/i.test(f.path)
  );

  for (const file of slideFiles) {
    const content = await file.buffer();
    const xml = content.toString('utf8');
    const json = parser.parse(xml);

    // Traverse and pull out all <a:t> text runs
    const collectText = (node) => {
      if (!node || typeof node !== 'object') return;
      // "a:t" appears as property names; fast-xml-parser maps it literally
      for (const key of Object.keys(node)) {
        const val = node[key];
        if (key === 'a:t') {
          if (typeof val === 'string') texts.push(val);
          else if (Array.isArray(val)) texts.push(val.join(' '));
        } else if (typeof val === 'object') {
          collectText(val);
        }
      }
    };

    collectText(json);
    texts.push('\n'); // separate slides
  }

  return texts.join(' ').replace(/\s+\n\s+/g, '\n').trim();
}

app.post('/extract', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No file uploaded' });
    }

    const mime = req.file.mimetype;
    const buffer = req.file.buffer;

    if (
      mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      (req.file.originalname || '').toLowerCase().endsWith('.pptx')
    ) {
      // PPTX
      const text = await extractTextFromPptxBuffer(buffer);
      return res.json({ ok: true, text: text || '' });
    }

    if (
      mime === 'application/vnd.ms-powerpoint' ||
      (req.file.originalname || '').toLowerCase().endsWith('.ppt')
    ) {
      // PPT via textract (may need OS deps)
      textract.fromBufferWithMime(mime, buffer, (err, text) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            error:
              'Failed to extract from PPT. Ensure required system tools are installed for textract.'
          });
        }
        return res.json({ ok: true, text: text || '' });
      });
      return;
    }

    return res.status(415).json({
      ok: false,
      error: 'Unsupported file type for backend. Use PPT/PPTX here.'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message || 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Extractor running on http://localhost:${PORT}`));
