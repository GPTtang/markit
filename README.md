# mill 🏭

Convert anything to markdown. Everything gets milled.

```bash
npm install -g mill-ai
```

## The Problem

Your agent needs to read a PDF. Or a DOCX. Or a spreadsheet someone emailed you. Or a web page. Or an EPUB. Or slides from a meeting.

But agents speak markdown.

```bash
mill report.pdf
```

That's it. PDF goes in, markdown comes out. Same for everything else.

---

## Quick Start

```bash
# Documents
mill report.pdf
mill document.docx
mill slides.pptx

# Data
mill data.csv
mill config.json
mill schema.yaml

# Web
mill https://example.com/article
mill https://en.wikipedia.org/wiki/Markdown

# Media (with AI features — set OPENAI_API_KEY)
mill photo.jpg              # EXIF metadata + AI description
mill recording.mp3          # Audio metadata + transcription

# Write to file
mill report.pdf -o report.md

# Pipe it
mill report.pdf | pbcopy
mill data.xlsx -q | napkin create "Imported Data"
```

---

## Supported Formats

| Format | Extensions | How |
|--------|-----------|-----|
| PDF | `.pdf` | Text extraction via unpdf |
| Word | `.docx` | mammoth → turndown, preserves headings/tables |
| PowerPoint | `.pptx` | XML parsing, slides + notes + tables |
| Excel | `.xlsx` `.xls` | Each sheet → markdown table *(optional dep)* |
| HTML | `.html` `.htm` | turndown, scripts/styles stripped |
| EPUB | `.epub` | Spine-ordered chapters, metadata header |
| Jupyter | `.ipynb` | Markdown cells + code + outputs |
| RSS/Atom | `.rss` `.atom` `.xml` | Feed items with dates and content |
| CSV/TSV | `.csv` `.tsv` | Markdown tables |
| JSON | `.json` | Pretty-printed code block |
| YAML | `.yaml` `.yml` | Code block |
| XML/SVG | `.xml` `.svg` | Code block |
| Images | `.jpg` `.png` `.gif` `.webp` | EXIF metadata + optional AI description |
| Audio | `.mp3` `.wav` `.m4a` `.flac` | Metadata + optional AI transcription |
| ZIP | `.zip` | Recursive — converts each file inside |
| URLs | `http://` `https://` | Fetches with `Accept: text/markdown` |
| Wikipedia | `*.wikipedia.org` | Main content extraction |
| Code | `.py` `.ts` `.go` `.rs` ... | Fenced code block |
| Plain text | `.txt` `.md` `.rst` `.log` | Pass-through |

---

## AI Features

Images and audio get metadata extraction for free. For AI-powered descriptions and transcription, set an API key:

```bash
export OPENAI_API_KEY=sk-...
mill photo.jpg        # EXIF + "A sunset over mountains with..."
mill interview.mp3    # Metadata + full transcript
```

Or configure it:

```bash
mill init
mill config set llm.apiKey sk-...
mill config set llm.model gpt-4o-mini
```

Works with any OpenAI-compatible API (OpenAI, Azure, Ollama, etc.):

```bash
mill config set llm.apiBase http://localhost:11434/v1
```

---

## For Agents

Every command supports `--json`. Raw markdown with `-q`.

```bash
# Structured output for parsing
mill report.pdf --json

# Raw markdown, nothing else
mill report.pdf -q

# Teach your agent about mill
mill onboard
```

---

## SDK

mill is also a library:

```typescript
import { Mill } from "mill-ai";

const mill = new Mill();
const { markdown } = await mill.convertFile("report.pdf");
const { markdown } = await mill.convertUrl("https://example.com");
const { markdown } = await mill.convert(buffer, { extension: ".docx" });
```

With AI features:

```typescript
import OpenAI from "openai";
import { Mill } from "mill-ai";

const mill = new Mill({
  llmClient: new OpenAI(),
  llmModel: "gpt-4o",
});

const { markdown } = await mill.convertFile("photo.jpg");
// → EXIF metadata + AI-generated description
```

Individual converters are importable too:

```typescript
import { PdfConverter, HtmlConverter } from "mill-ai";
```

---

## Configuration

```bash
mill init                              # Create .mill/config.json
mill config show                       # Show resolved settings
mill config get llm.model              # Get a value
mill config set llm.apiKey sk-...      # Set a value
```

`.mill/config.json`:

```json
{
  "llm": {
    "apiBase": "https://api.openai.com/v1",
    "apiKey": "sk-...",
    "model": "gpt-4o",
    "transcriptionModel": "gpt-4o-mini-transcribe"
  }
}
```

Env vars override config:

| Setting | Env var | Config key | Default |
|---------|---------|------------|---------|
| API key | `OPENAI_API_KEY` | `llm.apiKey` | — |
| API base | `OPENAI_BASE_URL` | `llm.apiBase` | `https://api.openai.com/v1` |
| Model | `MILL_MODEL` | `llm.model` | `gpt-4o` |
| Transcription | — | `llm.transcriptionModel` | `gpt-4o-mini-transcribe` |

---

## CLI Reference

```bash
mill <source>                          # Convert file or URL
mill <source> -o output.md             # Write to file
mill <source> -m gpt-4o-mini           # Override LLM model
mill <source> --json                   # JSON output
mill <source> -q                       # Raw markdown only
cat file.pdf | mill -                  # Read from stdin
mill formats                           # List supported formats
mill init                              # Create .mill/ config
mill config show                       # Show settings
mill config get <key>                  # Get config value
mill config set <key> <value>          # Set config value
mill onboard                           # Add to CLAUDE.md
```

---

## Development

```bash
bun install
bun run dev -- report.pdf
bun test
bun run check
```

## License

MIT
