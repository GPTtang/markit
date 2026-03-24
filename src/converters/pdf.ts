import type { Converter, ConversionResult, StreamInfo } from "../types.js";

const EXTENSIONS = [".pdf"];
const MIMETYPES = ["application/pdf", "application/x-pdf"];

export class PdfConverter implements Converter {
  name = "pdf";

  accepts(streamInfo: StreamInfo): boolean {
    if (streamInfo.extension && EXTENSIONS.includes(streamInfo.extension)) {
      return true;
    }
    if (
      streamInfo.mimetype &&
      MIMETYPES.some((m) => streamInfo.mimetype!.startsWith(m))
    ) {
      return true;
    }
    return false;
  }

  async convert(input: Buffer, _streamInfo: StreamInfo): Promise<ConversionResult> {
    let extractText: typeof import("unpdf").extractText;
    try {
      ({ extractText } = await import("unpdf"));
    } catch {
      throw new Error(
        "PDF support requires 'unpdf'. Install it: npm install unpdf",
      );
    }

    const result = await extractText(new Uint8Array(input));
    const text = Array.isArray(result.text)
      ? result.text.join("\n\n")
      : String(result.text);
    return { markdown: text.trim() };
  }
}
