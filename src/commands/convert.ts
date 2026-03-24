import { writeFileSync } from "node:fs";
import { Mill } from "../mill.js";
import type { OutputOptions } from "../utils/output.js";
import { output, success, error, dim } from "../utils/output.js";
import { EXIT_ERROR, EXIT_UNSUPPORTED } from "../utils/exit-codes.js";

export async function convert(
  source: string,
  options: OutputOptions & { output?: string },
): Promise<void> {
  const mill = new Mill();

  try {
    const isUrl =
      source.startsWith("http:") ||
      source.startsWith("https:") ||
      source.startsWith("file:");

    const result = isUrl
      ? await mill.convertUrl(source)
      : await mill.convertFile(source);

    // Write to file or stdout
    if (options.output) {
      writeFileSync(options.output, result.markdown);
      output(options, {
        json: () => ({
          success: true,
          source,
          output: options.output,
          title: result.title,
          length: result.markdown.length,
        }),
        human: () => {
          success(`Converted → ${options.output}`);
          if (result.title) console.log(dim(`  title: ${result.title}`));
          console.log(dim(`  ${result.markdown.length} chars`));
        },
      });
    } else {
      output(options, {
        json: () => ({
          success: true,
          source,
          title: result.title,
          markdown: result.markdown,
        }),
        quiet: () => process.stdout.write(result.markdown),
        human: () => process.stdout.write(result.markdown),
      });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("Unsupported format")) {
      output(options, {
        json: () => ({ success: false, error: msg }),
        human: () => error(msg),
      });
      process.exit(EXIT_UNSUPPORTED);
    }

    output(options, {
      json: () => ({ success: false, error: msg }),
      human: () => error(msg),
    });
    process.exit(EXIT_ERROR);
  }
}
