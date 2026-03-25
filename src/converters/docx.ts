import mammoth from "mammoth";
import TurndownService from "turndown";
import type { ConversionResult, Converter, StreamInfo } from "../types.js";

const EXTENSIONS = [".docx"];
const MIMETYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export class DocxConverter implements Converter {
  name = "docx";

  accepts(streamInfo: StreamInfo): boolean {
    if (streamInfo.extension && EXTENSIONS.includes(streamInfo.extension)) {
      return true;
    }
    if (
      streamInfo.mimetype &&
      MIMETYPES.some((m) => streamInfo.mimetype?.startsWith(m))
    ) {
      return true;
    }
    return false;
  }

  async convert(
    input: Buffer,
    _streamInfo: StreamInfo,
  ): Promise<ConversionResult> {
    const { value: html } = await mammoth.convertToHtml({ buffer: input });
    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });
    const markdown = turndown.turndown(html);
    return { markdown: markdown.trim() };
  }
}
