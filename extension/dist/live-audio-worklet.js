/* global AudioWorkletProcessor, sampleRate, registerProcessor */
// Every message is a complete PCM chunk, unlike consecutive WebM fragments.
class MeetingPcmProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.capacity = Math.round(sampleRate * options.processorOptions.chunkSeconds);
    this.samples = new Float32Array(this.capacity);
    this.position = 0;
    this.stopped = false;
    this.statusInterval = Math.round(sampleRate * (options.processorOptions.statusIntervalSeconds || 0));
    this.statusFrames = 0;
    this.receivedFrames = 0;
    this.energy = 0;
    this.energyFrames = 0;
    this.port.onmessage = ({ data }) => {
      if (data === "flush") {
        this.stopped = true;
        this.flush();
        this.port.postMessage({ type: "flushed" });
      }
    };
  }

  flush() {
    if (!this.position) return;
    const samples = this.samples.slice(0, this.position);
    this.port.postMessage({ type: "chunk", samples, sampleRate }, [samples.buffer]);
    this.position = 0;
  }

  process(inputs, outputs = []) {
    const channels = inputs[0];
    if (this.stopped) return true;
    const frames = channels?.[0]?.length || outputs[0]?.[0]?.length || 128;
    this.statusFrames += frames;
    for (let frame = 0; frame < (channels?.[0]?.length || 0); frame++) {
      let mono = 0;
      for (const channel of channels) mono += (Number.isFinite(channel[frame]) ? channel[frame] : 0) / channels.length;
      this.samples[this.position++] = mono;
      this.receivedFrames++;
      this.energy += mono * mono;
      this.energyFrames++;
      if (this.position === this.capacity) this.flush();
    }
    if (this.statusInterval && this.statusFrames >= this.statusInterval) {
      this.port.postMessage({ type: "status", hasInput: this.energyFrames > 0,
        rms: this.energyFrames ? Math.sqrt(this.energy / this.energyFrames) : 0,
        receivedSeconds: this.receivedFrames / sampleRate });
      this.statusFrames = 0;
      this.energy = 0;
      this.energyFrames = 0;
    }
    return true;
  }
}

registerProcessor("meeting-pcm", MeetingPcmProcessor);
