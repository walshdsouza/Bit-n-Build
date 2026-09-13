import type { GlossRow, SignPlan, TranscriptSegment } from "./types";

export interface SavedSegment extends TranscriptSegment {
  id?: string;
  original_text?: string;
}

export interface LocalProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceType: "file" | "youtube" | null;
  sourceUrl: string | null;
  mediaBlob: Blob | null;
  segments: SavedSegment[];
  glossRows: GlossRow[];
  plan: SignPlan;
  playbackRate: number;
  position: number;
  duration: number;
}

type StoredProject = Omit<LocalProject, "mediaBlob">;
export type LocalProjectSummary = Pick<LocalProject, "id" | "title" | "updatedAt" | "duration">;
type ProjectInput = Omit<LocalProject, "id" | "createdAt" | "updatedAt"> & { id?: string };
const DATABASE = "gesturesync-library";
const CHANGED = "gesturesync-library-changed";
let database: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("This browser does not support saving tracks on this device."));
  if (!database) database = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("projects", { keyPath: "id" });
      // Listing a library must not load every stored video into memory.
      request.result.createObjectStore("media");
    };
    request.onerror = () => { database = null; reject(request.error); };
    request.onblocked = () => { database = null; reject(new Error("Close other app tabs and try saving again.")); };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); database = null; };
      resolve(db);
    };
  });
  return database;
}

export async function saveLocalProject(input: ProjectInput): Promise<string> {
  const db = await openDatabase();
  const id = input.id ?? `saved-${crypto.randomUUID()}`;
  const { mediaBlob, ...details } = input;
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(["projects", "media"], "readwrite");
    const projects = transaction.objectStore("projects");
    const existing = projects.get(id);
    existing.onsuccess = () => {
      const now = new Date().toISOString();
      projects.put({ ...details, id, createdAt: existing.result?.createdAt ?? now, updatedAt: now });
      if (mediaBlob) transaction.objectStore("media").put(mediaBlob, id);
      else transaction.objectStore("media").delete(id);
    };
    // A successful put is not yet a committed save. Both records must finish.
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("The track could not be saved. Check your device storage and try again."));
    transaction.onerror = () => reject(transaction.error ?? new Error("The track could not be saved."));
  });
  window.dispatchEvent(new Event(CHANGED));
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(CHANGED);
    channel.postMessage(id);
    channel.close();
  }
  return id;
}

export async function getLocalProject(id: string): Promise<LocalProject | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projects", "media"], "readonly");
    const project = transaction.objectStore("projects").get(id);
    const media = transaction.objectStore("media").get(id);
    transaction.oncomplete = () => resolve(project.result ? { ...project.result, mediaBlob: media.result ?? null } : null);
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function listLocalProjects(): Promise<LocalProjectSummary[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction("projects", "readonly").objectStore("projects").getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve((request.result as StoredProject[])
      .map(({ id, title, updatedAt, duration }) => ({ id, title, updatedAt, duration }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  });
}

export function watchLocalProjects(changed: () => void): () => void {
  window.addEventListener(CHANGED, changed);
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANGED) : null;
  if (channel) channel.onmessage = changed;
  return () => { window.removeEventListener(CHANGED, changed); channel?.close(); };
}
