import { fetchTranscript } from "youtube-transcript-plus";
import { normalizeSegments } from "./segments";

/** Caption XML can retain entities, even after the source XML is parsed. */
export function decodeCaptionText(text: string): string {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  let decoded = text;
  for (let pass = 0; pass < 2; pass++) {
    decoded = decoded.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
      if (!code.startsWith("#")) return named[code.toLowerCase()] ?? entity;
      const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point) : entity;
    });
  }
  return decoded.replace(/\s+/g, " ").trim();
}

/** Native Node fetch runs on serverless hosts without a Python installation. */
export async function fetchNativeYouTubeCaptions(videoId: string) {
  const transcript = await fetchTranscript(videoId, { lang: "en", signal: AbortSignal.timeout(15_000) });
  return normalizeSegments(transcript.map((segment) => ({
    start: segment.offset, end: segment.offset + segment.duration, text: decodeCaptionText(segment.text),
  })));
}
