#!/usr/bin/env node

import { createRequire } from "node:module";
import { Command } from "commander";
import { convert } from "./commands/convert.js";
import { onboard } from "./commands/onboard.js";
import { formats } from "./commands/formats.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

program
  .name("mill")
  .description("Convert anything to markdown. Everything gets milled.")
  .version(`mill ${version}`, "-v, --version")
  .option("--json", "Output as JSON")
  .option("-q, --quiet", "Suppress output");

program
  .command("convert")
  .alias("c")
  .description("Convert a file or URL to markdown")
  .argument("<source>", "File path or URL")
  .option("-o, --output <file>", "Write to file instead of stdout")
  .action(async (source, opts, cmd) => {
    const globals = cmd.optsWithGlobals();
    await convert(source, {
      json: globals.json,
      quiet: globals.quiet,
      output: opts.output,
    });
  });

// Default command: `mill <source>` is the same as `mill convert <source>`
program
  .argument("[source]", "File path or URL to convert")
  .option("-o, --output <file>", "Write to file instead of stdout")
  .action(async (source, opts, cmd) => {
    if (!source) {
      program.help();
      return;
    }
    const globals = cmd.optsWithGlobals();
    await convert(source, {
      json: globals.json,
      quiet: globals.quiet,
      output: opts.output,
    });
  });

program
  .command("formats")
  .description("List supported formats")
  .action(async (_opts, cmd) => {
    const globals = cmd.optsWithGlobals();
    await formats([], { json: globals.json, quiet: globals.quiet });
  });

program
  .command("onboard")
  .description("Add mill instructions to CLAUDE.md or AGENTS.md")
  .action(async (_opts, cmd) => {
    const globals = cmd.optsWithGlobals();
    await onboard([], { json: globals.json, quiet: globals.quiet });
  });

program.parseAsync(process.argv).catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
