"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TabAudioCapture from "./TabAudioCapture";

interface IngestionCardProps {
  serverTranscriptionProvider?: "groq" | "openai" | null;
  serverYouTubeConfigured?: boolean;
}

interface ImportError {
  message: string;
  source: "youtube" | "file";
  code?: string;
}

export default function IngestionCard({ serverTranscriptionProvider = null, serverYouTubeConfigured = false }: IngestionCardProps) {
  const router = useRouter();
  const transcriptionConfigured = Boolean(serverTranscriptionProvider);
  const youtubeConfigured = serverYouTubeConfigured;
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importStage, setImportStage] = useState("Importing source…");
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => requestRef.current?.abort(), []);
  const [capturing, setCapturing] = useState(false);
  const busy = loading || capturing;
  const [error, setError] = useState<ImportError | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSynthesize = async () => {
    if (busy || (!url.trim() && !fileToUpload)) return;
    setLoading(true);
    setImportStage("Importing source…");
    setError(null);
    const controller = new AbortController();
    requestRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 8 * 60 * 1000);
    let objectUrl: string | null = null;
    try {
      if (fileToUpload && fileToUpload.size > 4 * 1024 * 1024) {
        throw new Error("Please upload a clip smaller than 4 MB. Trim or compress longer media before uploading.");
      }
      let body: string | FormData;

      if (url.trim()) {
        let pending: { url?: string; jobToken?: string } = {};
        try {
          const stored: unknown = JSON.parse(sessionStorage.getItem("youtubeImportJob") || "{}");
          if (stored && typeof stored === "object") pending = stored;
        } catch { /* No resumable job. */ }
        body = JSON.stringify({ url: url.trim(), ...(pending.url === url.trim() && typeof pending.jobToken === "string" && pending.jobToken ? { jobToken: pending.jobToken } : {}) });
      } else {
        body = new FormData();
        if (fileToUpload) {
          body.append("file", fileToUpload);
          objectUrl = URL.createObjectURL(fileToUpload);
        }
      }

      let res = await fetch("/api/process-video", {
        method: "POST",
        headers: url.trim() ? { "Content-Type": "application/json" } : {},
        body,
        signal: controller.signal,
      });

      let raw: unknown = await res.json().catch(() => null);
      let data = raw && typeof raw === "object" ? raw as Record<string, unknown> : null;
      while (res.status === 202 && data?.pending === true && typeof data.jobToken === "string") {
        const jobToken = data.jobToken;
        sessionStorage.setItem("youtubeImportJob", JSON.stringify({ url: url.trim(), jobToken }));
        if (typeof data.pollAfterMs === "number" && Number.isFinite(data.pollAfterMs) && data.pollAfterMs > 30000) {
          const minutes = Math.max(1, Math.ceil(data.pollAfterMs / 60000));
          throw new Error(`The translation service is busy. Your progress is saved. Retry in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`);
        }
        setImportStage("Preparing YouTube transcript…");
        const pause = typeof data.pollAfterMs === "number" ? Math.max(1000, Math.min(10000, data.pollAfterMs)) : 2500;
        await new Promise<void>((resolve, reject) => {
          if (controller.signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
          const onAbort = () => { window.clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); };
          const timer = window.setTimeout(() => { controller.signal.removeEventListener("abort", onAbort); resolve(); }, pause);
          controller.signal.addEventListener("abort", onAbort, { once: true });
        });
        res = await fetch("/api/process-video", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim(), jobToken }), signal: controller.signal,
        });
        raw = await res.json().catch(() => null);
        data = raw && typeof raw === "object" ? raw as Record<string, unknown> : null;
      }
      if (res.ok && data?.success === true && Array.isArray(data.segments) && data.segments.length) {
        if (url.trim()) sessionStorage.removeItem("youtubeImportJob");
        const previous = sessionStorage.getItem("sourceVideoUrl");
        if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
        sessionStorage.setItem("sourceVideoUrl", objectUrl ?? url.trim());
        sessionStorage.setItem("sourceType", objectUrl ? "file" : "youtube");
        const metadata = data.metadata && typeof data.metadata === "object" ? data.metadata as Record<string, unknown> : null;
        const title = fileToUpload?.name || (typeof metadata?.title === "string" ? metadata.title : undefined);
        sessionStorage.setItem("processedTranscript", JSON.stringify({ ...data, ...(title ? { title } : {}) }));
        router.push(`/player/${typeof data.projectId === "string" ? encodeURIComponent(data.projectId) : "local"}`);
      } else {
        if (data?.code === "YOUTUBE_JOB_INVALID" || data?.code === "NO_SPEECH" || data?.code === "YOUTUBE_VIDEO_UNAVAILABLE" || data?.code === "YOUTUBE_LANGUAGE_UNSUPPORTED") sessionStorage.removeItem("youtubeImportJob");
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        const fallback = res.status === 413
          ? "The upload is too large. Choose a clip smaller than 4 MB."
          : res.status === 504 || res.status === 408
            ? "The import timed out. Retry this source or choose a shorter audio or video file."
            : "The import could not be completed. Please retry your source.";
        setError({
          message: typeof data?.error === "string" && data.error.trim() ? data.error : fallback,
          source: url.trim() ? "youtube" : "file",
          code: typeof data?.code === "string" ? data.code : undefined,
        });
      }
    } catch (error) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setError({
        message: controller.signal.aborted ? (timedOut ? "This import is taking longer than expected. Retry to resume the existing YouTube job." : "Import stopped. Retry to resume a pending YouTube import.")
          : error instanceof TypeError ? "The import request could not reach the server. Check your connection and retry."
          : error instanceof Error ? error.message : "The media could not be processed.",
        source: url.trim() ? "youtube" : "file",
      });
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) requestRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="font-label-tech text-label-tech text-on-surface-variant uppercase tracking-widest mb-1">New Translation</p>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Ingest Source Media</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
            {transcriptionConfigured ? "Transcription configured" : "Media import"}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); if (!busy) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (busy) return;
            const file = e.dataTransfer.files[0];
            if (file) { setFileToUpload(file); setUrl(""); setError(null); }
          }}
          onClick={() => { if (!busy) fileRef.current?.click(); }}
          role="button"
          tabIndex={0}
          aria-label="Choose a video or audio file"
          aria-disabled={busy}
          onKeyDown={(e) => { if (!busy && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); fileRef.current?.click(); } }}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(76,215,246,0.15)]"
              : "border-outline-variant/60 hover:border-primary/40 hover:bg-surface-container-low/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            disabled={busy}
            aria-label="Source media file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setFileToUpload(file); setUrl(""); setError(null); }
            }}
          />
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? "bg-primary/20 shadow-[0_0_30px_rgba(76,215,246,0.35)]" : "bg-surface-container-low"}`}>
            <span className="material-symbols-outlined text-[36px] text-primary">video_call</span>
          </div>
          {fileToUpload ? (
            <div className="text-center">
              <p className="text-on-surface font-semibold text-sm">{fileToUpload.name}</p>
              <p className="text-on-surface-variant text-xs mt-1">Selected for import</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-on-surface font-semibold">Drop video or audio file</p>
              <p className="text-on-surface-variant text-sm mt-1">MP4, WebM, MOV, MP3, M4A · up to 4 MB</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-outline-variant/30" />
          <span className="text-xs text-outline font-medium">or paste URL</span>
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        {/* URL input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">link</span>
            <input
              type="url"
              disabled={busy}
              aria-describedby="youtube-import-note"
              aria-label="YouTube URL"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setFileToUpload(null); setError(null); }}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-outline transition-all"
            />
          </div>
        </div>
        <p id="youtube-import-note" className="mt-2 text-xs leading-relaxed text-on-surface-variant">
          {youtubeConfigured ? "YouTube import is configured. Public videos use captions when available, with audio transcription as a fallback."
            : "Direct YouTube imports are unavailable right now. You can capture the video’s tab audio below."}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
          {transcriptionConfigured ? "Audio transcription is ready." : "Audio transcription is currently unavailable. Please try again later."}
        </p>

        {/* Synthesize */}
        {error && (
          <div className="mt-3 rounded-lg border border-error/25 bg-error/5 p-3">
            <p role="alert" aria-label="Import error" className="text-sm text-error">{error.message}</p>
            {error.source === "youtube" && (
              <div className="mt-3 space-y-2">
                <p className="text-xs leading-relaxed text-on-surface-variant">Your URL has been kept. Retry the import, or choose an audio or video file with spoken audio.</p>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="min-h-11 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm text-primary hover:bg-surface-container-high disabled:opacity-50">Choose a file instead</button>
              </div>
            )}
          </div>
        )}
        <TabAudioCapture disabled={loading} selectedFile={fileToUpload} onBusyChange={setCapturing} onRecorded={(file) => {
          setFileToUpload(file);
          setUrl("");
          setError(null);
        }} />
        <button
          onClick={handleSynthesize}
          disabled={busy || (!url.trim() && !fileToUpload)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-space-lg py-3 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-on-primary/40 border-t-on-primary animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[20px]">sign_language</span>
          )}
          <span>{loading ? importStage : error ? "Retry import" : "Synthesize ASL ›"}</span>
        </button>
        {loading && <button type="button" onClick={() => requestRef.current?.abort()} className="mt-2 min-h-11 w-full rounded-lg border border-outline-variant/40 text-sm text-on-surface">Stop import</button>}

        {/* Caption */}
        <p className="text-center text-xs text-outline mt-3">
          Translates speech or captions into ASL signs. Hand movements in source videos are not recognized.
        </p>
      </div>
    </div>
  );
}
