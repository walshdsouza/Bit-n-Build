/** One transcription request at a time, with bounded memory and cancellation. */
export class LiveChunkQueue<T> {
  private pending: T[] = [];
  private busy = false;
  private closed = false;
  private controller = new AbortController();

  constructor(
    private readonly process: (item: T, signal: AbortSignal) => Promise<void>,
    private readonly onCount: (count: number) => void,
    private readonly onError: (error: unknown) => void,
    private readonly capacity = 6,
  ) {}

  push(item: T): boolean {
    if (this.closed || this.pending.length + Number(this.busy) >= this.capacity) return false;
    this.pending.push(item);
    this.onCount(this.pending.length + Number(this.busy));
    void this.drain();
    return true;
  }

  close() {
    this.closed = true;
    this.pending = [];
    this.controller.abort();
    this.onCount(0);
  }

  private async drain() {
    if (this.busy || this.closed) return;
    this.busy = true;
    try {
      while (!this.closed && this.pending.length) {
        const item = this.pending.shift()!;
        await this.process(item, this.controller.signal);
        if (!this.closed) this.onCount(this.pending.length);
      }
    } catch (error) {
      if (!this.closed) { this.close(); this.onError(error); }
    } finally {
      this.busy = false;
    }
  }
}
