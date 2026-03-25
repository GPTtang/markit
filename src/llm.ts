import type { MarkitOptions } from "./types.js";
import type { MarkitConfig } from "./config.js";
import {
  resolveApiKey,
  resolveApiBase,
  resolveModel,
  resolveTranscriptionModel,
} from "./config.js";

/**
 * Build describe/transcribe functions from .markit/config.json + env vars.
 * Uses the OpenAI-compatible provider by default.
 */
export function createLlmFunctions(config: MarkitConfig): MarkitOptions {
  const apiKey = resolveApiKey(config);
  if (!apiKey) return {};

  const provider = config.llm?.provider || "openai";

  if (provider === "anthropic") {
    return {
      describe: createAnthropicDescribe(config),
      // Anthropic doesn't have a transcription API — leave undefined
    };
  }

  return {
    describe: createOpenAIDescribe(config),
    transcribe: createOpenAITranscribe(config),
  };
}

// ── OpenAI-compatible (also works with Groq, Together, Fireworks, Ollama) ──

export function createOpenAIDescribe(
  config: MarkitConfig,
): (image: Buffer, mimetype: string) => Promise<string> {
  const apiKey = resolveApiKey(config)!;
  const baseUrl = resolveApiBase(config).replace(/\/+$/, "");
  const model = resolveModel(config);

  return async (image: Buffer, mimetype: string): Promise<string> => {
    const base64 = image.toString("base64");

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Write a detailed description of this image." },
              { type: "image_url", image_url: { url: `data:${mimetype};base64,${base64}` } },
            ],
          },
        ],
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${body}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  };
}

export function createOpenAITranscribe(
  config: MarkitConfig,
): (audio: Buffer, mimetype: string) => Promise<string> {
  const apiKey = resolveApiKey(config)!;
  const baseUrl = resolveApiBase(config).replace(/\/+$/, "");
  const transcriptionModel = resolveTranscriptionModel(config);

  return async (audio: Buffer, mimetype: string): Promise<string> => {
    const ext = mimeToExt(mimetype);
    const file = new File([audio], `audio${ext}`, { type: mimetype });

    const formData = new FormData();
    formData.append("model", transcriptionModel);
    formData.append("file", file);

    const res = await fetch(`${baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Transcription API error ${res.status}: ${body}`);
    }

    const data: any = await res.json();
    return data.text ?? "";
  };
}

// ── Anthropic ───────────────────────────────────────────────────────────────

export function createAnthropicDescribe(
  config: MarkitConfig,
): (image: Buffer, mimetype: string) => Promise<string> {
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    config.llm?.apiKey ||
    resolveApiKey(config)!;
  const baseUrl = (
    process.env.ANTHROPIC_BASE_URL ||
    config.llm?.apiBase ||
    "https://api.anthropic.com"
  ).replace(/\/+$/, "");
  const model = resolveModel(config, undefined) || "claude-sonnet-4-20250514";

  return async (image: Buffer, mimetype: string): Promise<string> => {
    const base64 = image.toString("base64");

    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimetype,
                  data: base64,
                },
              },
              { type: "text", text: "Write a detailed description of this image." },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${body}`);
    }

    const data: any = await res.json();
    return data.content?.[0]?.text ?? "";
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/mp4": ".m4a",
    "video/mp4": ".mp4",
    "audio/ogg": ".ogg",
    "audio/flac": ".flac",
    "audio/aac": ".aac",
  };
  return map[mime] || ".mp3";
}
