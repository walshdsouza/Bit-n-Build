/** Accept only actual YouTube hosts and complete video IDs. */
export function extractYouTubeVideoId(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  const valid = (id: string | null | undefined) => id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  if (valid(trimmed)) return trimmed;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (host === "youtu.be" || host === "www.youtu.be") return valid(url.pathname.split("/")[1]);
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host)) return null;
    if (url.pathname === "/watch") return valid(url.searchParams.get("v"));
    const [, prefix, id] = url.pathname.split("/");
    return ["embed", "v", "shorts", "live"].includes(prefix) ? valid(id) : null;
  } catch {
    return null;
  }
}
