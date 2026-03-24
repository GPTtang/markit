# mill

🏭 Convert anything to markdown. Everything gets milled.

## Install

```bash
npm install -g mill-ai
```

## Usage

```bash
# Convert a file
mill report.pdf
mill document.docx
mill data.csv

# Convert a URL
mill https://example.com/article

# Write to file
mill report.pdf -o report.md

# Pipe it
mill report.pdf | pbcopy
mill data.xlsx -q | napkin create "Imported Data"
```

## Supported Formats

| Format | Extensions | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Text extraction via unpdf |
| Word | `.docx` | Headings, tables, lists preserved |
| Excel | `.xlsx`, `.xls` | Each sheet becomes a markdown table |
| HTML | `.html`, `.htm` | Scripts/styles stripped, structure preserved |
| CSV | `.csv`, `.tsv` | Converted to markdown tables |
| JSON | `.json` | Pretty-printed in a code block |
| Plain text | `.txt`, `.md`, `.rst`, `.log` | Pass-through or minimal wrapping |
| Code | `.py`, `.js`, `.ts`, `.go`, `.rs`, ... | Wrapped in fenced code blocks |
| URLs | `http://`, `https://` | Fetched and converted (prefers markdown) |

## For Agents

```bash
# Structured output
mill report.pdf --json

# Raw markdown, no decoration
mill report.pdf -q

# Teach your agent about mill
mill onboard
```

## Commands

```bash
mill <source>              # Convert file or URL to markdown
mill convert <source>      # Same as above (explicit)
mill formats               # List supported formats
mill onboard               # Add mill instructions to CLAUDE.md
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--json` | Output as JSON |
| `-q, --quiet` | Raw markdown only |
| `-o, --output <file>` | Write to file |
| `-v, --version` | Show version |

## License

MIT
