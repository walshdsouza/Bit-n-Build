"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function IngestionCard() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSynthesize = async () => {
    if (!url && !fileToUpload) return;
    setLoading(true);
    try {
      let body: string | FormData;
      let objectUrl: string | null = null;

      if (url) {
        body = JSON.stringify({ url });
        sessionStorage.setItem("sourceVideoUrl", url);
        sessionStorage.setItem("sourceType", "youtube");
      } else {
        body = new FormData();
        if (fileToUpload) {
          body.append("file", fileToUpload);
          objectUrl = URL.createObjectURL(fileToUpload);
          sessionStorage.setItem("sourceVideoUrl", objectUrl);
          sessionStorage.setItem("sourceType", "file");
        }
      }

      const res = await fetch("/api/process-video", {
        method: "POST",
        headers: url ? { "Content-Type": "application/json" } : undefined,
        body,
      });

      const data = await res.json();
      console.log("Process Video Result:", data);

      if (data.success) {
        if (!data.projectId) {
          console.warn("Project ID missing, falling back to demo mode.", data.metadata?.dbError);
          alert("Notice: Could not save project to database. You will see a demo preview. Reason: " + 
            (data.metadata?.dbError?.message || data.metadata?.dbError || "Not logged in or DB error"));
        }
        
        sessionStorage.setItem("sourceVideoUrl", url);
        sessionStorage.setItem("sourceType", "youtube");
        sessionStorage.setItem("processedTranscript", JSON.stringify(data));
        setLoading(false);
        router.push(`/player/${data.projectId || "demo"}`);
      } else {
        alert("Ingestion Failed: " + (data.error || "Unknown error"));
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Ingestion failed:", error);
      alert("Ingestion Failed: " + (error.message || String(error)));
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
      <div className="absolute inset-0 bg-blueprint pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-label-tech text-label-tech text-on-surface-variant uppercase tracking-widest mb-1">New Translation</p>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Ingest Source Media</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Pipeline Ready
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) setFileToUpload(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(76,215,246,0.15)]"
              : "border-outline-variant/60 hover:border-primary/40 hover:bg-surface-container-low/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFileToUpload(file);
            }}
          />
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? "bg-primary/20 shadow-[0_0_30px_rgba(76,215,246,0.35)]" : "bg-surface-container-low"}`}>
            <span className="material-symbols-outlined text-[36px] text-primary">video_call</span>
          </div>
          {fileToUpload ? (
            <div className="text-center">
              <p className="text-on-surface font-semibold text-sm">{fileToUpload.name}</p>
              <p className="text-on-surface-variant text-xs mt-1">Ready to synthesize</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-on-surface font-semibold">Drop video or audio file</p>
              <p className="text-on-surface-variant text-sm mt-1">MP4, WebM, MOV, MP3, M4A · up to 2GB</p>
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-outline transition-all"
            />
          </div>
        </div>

        {/* Synthesize */}
        <button
          onClick={handleSynthesize}
          disabled={loading || (!url && !fileToUpload)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-space-lg py-3 rounded-full bg-gradient-to-r from-secondary-container to-primary-container text-on-primary font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-on-primary/40 border-t-on-primary animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[20px]">sign_language</span>
          )}
          <span>{loading ? "Initializing Pipeline…" : "Synthesize ASL ›"}</span>
        </button>

        {/* Caption */}
        <p className="text-center text-xs text-outline mt-3">
          Whisper V3 · GPT-4o Gloss · CWASA Avatar · ~85ms latency
        </p>
      </div>
    </div>
  );
}
