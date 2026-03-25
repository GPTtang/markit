import type { ConversionResult, Converter, StreamInfo } from "../types.js";

const EXTENSIONS = [".json"];
const MIMETYPES = ["application/json"];

export class JsonConverter implements Converter {
  name = "json";

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
    const text = new TextDecoder("utf-8").decode(input);
    const parsed = JSON.parse(text);
    const pretty = JSON.stringify(parsed, null, 2);
    return { markdown: `\`\`\`json\n${pretty}\n\`\`\`` };
  }
}
