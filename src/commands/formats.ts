import type { OutputOptions } from "../utils/output.js";
import { output, bold, dim } from "../utils/output.js";

const FORMATS = [
  { name: "PDF", extensions: [".pdf"], builtin: true },
  { name: "Word", extensions: [".docx"], builtin: true },
  { name: "Excel", extensions: [".xlsx", ".xls"], builtin: false, dep: "xlsx" },
  { name: "HTML", extensions: [".html", ".htm"], builtin: true },
  { name: "CSV", extensions: [".csv", ".tsv"], builtin: true },
  { name: "JSON", extensions: [".json"], builtin: true },
  { name: "Plain text", extensions: [".txt", ".md", ".rst", ".log"], builtin: true },
  { name: "Code", extensions: [".py", ".js", ".ts", ".go", ".rs", "..."], builtin: true },
  { name: "URLs", extensions: ["http://", "https://"], builtin: true },
];

export async function formats(
  _args: string[],
  options: OutputOptions,
): Promise<void> {
  output(options, {
    json: () => ({ formats: FORMATS }),
    human: () => {
      console.log();
      console.log(bold("Supported formats"));
      console.log();
      for (const fmt of FORMATS) {
        const exts = fmt.extensions.join(", ");
        const note = fmt.builtin ? "" : dim(` (requires: npm i ${fmt.dep})`);
        console.log(`  ${fmt.name.padEnd(12)} ${dim(exts)}${note}`);
      }
      console.log();
    },
  });
}
