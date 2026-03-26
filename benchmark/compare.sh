#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MARKIT_OUT="$SCRIPT_DIR/results/markit"
MARKITDOWN_OUT="$SCRIPT_DIR/results/markitdown"

echo "# Quality Comparison"
echo ""

for f in "$MARKIT_OUT"/*.md; do
  name=$(basename "$f")
  other="$MARKITDOWN_OUT/$name"

  echo "## $name"
  echo ""

  if [ ! -f "$other" ]; then
    echo "⚠️  markitdown output missing"
    echo ""
    continue
  fi

  markit_lines=$(wc -l < "$f" | tr -d ' ')
  markitdown_lines=$(wc -l < "$other" | tr -d ' ')
  markit_bytes=$(wc -c < "$f" | tr -d ' ')
  markitdown_bytes=$(wc -c < "$other" | tr -d ' ')

  echo "| Metric | markit | markitdown |"
  echo "|--------|--------|------------|"
  echo "| Lines  | $markit_lines | $markitdown_lines |"
  echo "| Bytes  | $markit_bytes | $markitdown_bytes |"
  echo ""

  # Show diff stats
  diff_output=$(diff "$f" "$other" 2>/dev/null || true)
  if [ -z "$diff_output" ]; then
    echo "✅ Identical output"
  else
    adds=$(echo "$diff_output" | grep -c '^>' || true)
    removes=$(echo "$diff_output" | grep -c '^<' || true)
    echo "Diff: +$adds/-$removes lines"
  fi
  echo ""
done
