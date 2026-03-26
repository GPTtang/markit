# Benchmark: markit vs Microsoft markitdown

Reproducible benchmark comparing [markit](https://github.com/your/markit) against Microsoft's [markitdown](https://github.com/microsoft/markitdown).

## Quick start

```bash
# 1. Install dependencies
pip install 'markitdown[all]' python-docx python-pptx openpyxl
brew install hyperfine

# 2. Set up test corpus (downloads + generates files)
./benchmark/setup-corpus.sh

# 3. Run the benchmark
./benchmark/run.sh
```

## What it tests

| Format | File | Size | Source |
|--------|------|------|--------|
| PDF | US Constitution | 404KB | constitutioncenter.org |
| PDF | Bitcoin Whitepaper | 180KB | bitcoin.org |
| DOCX | Calibre Demo | 1.3MB | calibre-ebook.com |
| DOCX | Tech Architecture | 37KB | Generated |
| XLSX | Financial Sample | 81KB | Microsoft sample data |
| HTML | Wikipedia (Markdown) | 190KB | en.wikipedia.org |
| EPUB | Alice in Wonderland | 185KB | Project Gutenberg |
| CSV | Titanic Dataset | 59KB | Kaggle/GitHub |
| CSV | 1000 Customers | 87KB | Generated |
| PPTX | Q4 Business Review | 34KB | Generated |

## Output

```
benchmark/results/
  summary.md      # Markdown table with speed + quality comparison
  speed.json      # Raw hyperfine JSON for further analysis
  markit/         # markit markdown outputs
  markitdown/     # markitdown markdown outputs
```

## What it measures

- **Speed**: Wall-clock time via `hyperfine` (warmup + min 3 runs)
- **Quality**: Byte count comparison + line-level diff stats
