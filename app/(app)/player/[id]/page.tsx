"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import SplitViewport from "@/components/player/SplitViewport";
import Timeline from "@/components/player/Timeline";
import GlossInspector from "@/components/player/GlossInspector";
import { createClient } from "@/utils/supabase/client";

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [playing, setPlaying] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [project, setProject] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(id !== "demo");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (id === "demo") {
      // Demo fallback: Read from sessionStorage
      const url = sessionStorage.getItem("sourceVideoUrl");
      const type = sessionStorage.getItem("sourceType");
      const raw = sessionStorage.getItem("processedTranscript");
      
      let parsedSegments = [];
      if (raw) {
        try {
          const data = JSON.parse(raw);
          parsedSegments = data.segments?.map((s: any, i: number) => ({
            id: String(i),
            start: s.start,
            end: s.end,
            text: s.text,
            original_text: s.text
          })) || [];
        } catch {}
      }

      setProject({
        title: "Demo Translation (Not Saved)",
        source_url: url,
        source_type: type,
      });
      setSegments(parsedSegments);
      setLoading(false);
      return;
    }

    async function loadData() {
      // Fetch project
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (projData) setProject(projData);

      // Fetch segments
      const { data: segData, error: segErr } = await supabase
        .from('transcript_segments')
        .select('*')
        .eq('project_id', id)
        .order('sequence_index', { ascending: true });
        
      if (segData) {
        // Map DB snake_case back to expected format
        const mapped = segData.map(s => ({
          id: s.id,
          start: s.start_time,
          end: s.end_time,
          text: s.edited_text || s.original_text,
          original_text: s.original_text
        }));
        setSegments(mapped);
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [id]);

  const handleUpdateSegment = (idx: number, newText: string) => {
    const updated = [...segments];
    updated[idx].text = newText;
    setSegments(updated);
  };

  const handleSave = async () => {
    if (id === "demo") return;
    setSaving(true);
    try {
      // Bulk update using Supabase upsert
      const toUpsert = segments.map((s, i) => ({
        id: s.id,
        project_id: id,
        sequence_index: i,
        start_time: s.start,
        end_time: s.end,
        original_text: s.original_text,
        edited_text: s.text
      }));
      
      const { error } = await supabase.from('transcript_segments').upsert(toUpsert);
      if (error) throw error;
      
      alert("Successfully saved to database!");
    } catch (e: any) {
      console.error(e);
      alert("Failed to save: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-on-surface bg-[#060a0f]">Loading project...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#060a0f]">
      {/* Player nav */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
        <Link href="/dashboard" className="w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface truncate">
            {project ? project.title : "Demo Translation"}
          </p>
          <p className="text-xs text-on-surface-variant">
            {duration > 0 ? `${Math.round(duration)}s` : "0:00"} · English → ASL
          </p>
        </div>
        
        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || id === "demo"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[14px]">save</span>
          {saving ? "Saving..." : "Save Edits"}
        </button>

        {/* Toggle gloss inspector */}
        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            inspectorOpen ? "bg-primary/15 text-primary" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
          Gloss
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-on-surface-variant bg-surface-container hover:text-on-surface transition-all">
          <span className="material-symbols-outlined text-[14px]">download</span>
          Export
        </button>
      </div>

      {/* Main split area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Player area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <SplitViewport
            playing={playing}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            onDurationChange={setDuration}
            onPlayPause={() => setPlaying((p) => !p)}
            project={project}
            segments={segments}
          />
          <Timeline
            playing={playing}
            onPlayPause={() => setPlaying((p) => !p)}
            currentTime={currentTime}
            duration={duration}
            onSeek={setCurrentTime}
          />
        </div>

        {/* Gloss inspector panel */}
        {inspectorOpen && (
          <div className="w-[280px] flex-shrink-0 hidden md:flex">
            <GlossInspector 
              currentTime={currentTime} 
              segments={segments}
              onUpdateSegment={handleUpdateSegment}
            />
          </div>
        )}
      </div>
    </div>
  );
}
