/**
 * Ambient sound, synthesised with the Web Audio API — no audio files.
 *
 *   wind     pink noise → band-pass swept by a slow LFO → gusting gain → slow pan
 *   whistle  pink noise → narrow band-pass high up, very quiet
 *   rumble   brown noise → low-pass: the body of a distant fire
 *   crackle  short white-noise bursts through a high-pass, scheduled in
 *            clusters with a look-ahead timer (fires pop in groups)
 *
 * Browsers only allow audio after a user gesture, so `start()` must be called
 * from a click/keypress handler.
 */

function noiseBuffer(ctx: AudioContext, seconds: number, colour: "white" | "pink" | "brown"): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    // Paul Kellet's refined pink filter state / brown integrator state.
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let brown = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (colour === "white") {
        data[i] = white;
      } else if (colour === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        brown = (brown + 0.02 * white) / 1.02;
        data[i] = brown * 3.5;
      }
    }
  }
  return buffer;
}

export class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private fire: GainNode | null = null;
  private white: AudioBuffer | null = null;
  private timer = 0;
  private nextCrackle = 0;
  private heat = 0;
  running = false;

  private build(): void {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const pink = noiseBuffer(ctx, 6, "pink");
    const brown = noiseBuffer(ctx, 6, "brown");
    this.white = noiseBuffer(ctx, 1, "white");

    const loop = (buffer: AudioBuffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.start(0, Math.random() * buffer.duration);
      return source;
    };
    const lfo = (frequency: number, depth: number, target: AudioParam) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      gain.gain.value = depth;
      osc.connect(gain).connect(target);
      osc.start();
    };

    // Wind.
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 460;
    band.Q.value = 0.85;
    const wind = ctx.createGain();
    wind.gain.value = 0.26;
    const pan = ctx.createStereoPanner();
    loop(pink).connect(band).connect(wind).connect(pan).connect(master);
    lfo(0.043, 240, band.frequency);
    lfo(0.11, 0.13, wind.gain);
    lfo(0.027, 0.55, pan.pan);

    // Whistle through the ruins.
    const whistle = ctx.createBiquadFilter();
    whistle.type = "bandpass";
    whistle.frequency.value = 1750;
    whistle.Q.value = 7;
    const whistleGain = ctx.createGain();
    whistleGain.gain.value = 0.035;
    loop(pink).connect(whistle).connect(whistleGain).connect(master);
    lfo(0.07, 380, whistle.frequency);
    lfo(0.05, 0.03, whistleGain.gain);

    // Distant fire: rumble + crackles share one bus so heat can scale both.
    const fire = ctx.createGain();
    fire.gain.value = 0.55;
    fire.connect(master);
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 150;
    const rumble = ctx.createGain();
    rumble.gain.value = 0.45;
    loop(brown).connect(low).connect(rumble).connect(fire);

    this.ctx = ctx;
    this.master = master;
    this.fire = fire;
  }

  /** Schedule crackles ~300 ms ahead; called every 100 ms while running. */
  private schedule = (): void => {
    const ctx = this.ctx;
    const fire = this.fire;
    const white = this.white;
    if (!ctx || !fire || !white) return;
    const horizon = ctx.currentTime + 0.3;
    if (this.nextCrackle < ctx.currentTime) this.nextCrackle = ctx.currentTime + 0.05;
    while (this.nextCrackle < horizon) {
      const t = this.nextCrackle;
      const duration = 0.012 + Math.random() * 0.05;
      const source = ctx.createBufferSource();
      source.buffer = white;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1300 + Math.random() * 2600;
      const env = ctx.createGain();
      const amp = (0.05 + Math.random() * 0.16) * (0.6 + this.heat * 0.8);
      env.gain.setValueAtTime(amp, t);
      env.gain.exponentialRampToValueAtTime(0.0008, t + duration);
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 1.4 - 0.7;
      source.connect(hp).connect(env).connect(pan).connect(fire);
      source.start(t, Math.random() * 0.9, duration + 0.02);
      // Clustered arrivals: mostly quick follow-ups, sometimes a lull.
      const rate = 4 + this.heat * 9;
      this.nextCrackle += Math.random() < 0.72 ? Math.random() * 0.09 : -Math.log(1 - Math.random()) / rate;
    }
  };

  async start(): Promise<void> {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    await ctx.resume();
    this.running = true;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.setTargetAtTime(0.7, ctx.currentTime, 0.9);
    window.clearInterval(this.timer);
    this.timer = window.setInterval(this.schedule, 100);
  }

  async stop(): Promise<void> {
    const ctx = this.ctx;
    this.running = false;
    window.clearInterval(this.timer);
    if (!ctx || !this.master) return;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
    await new Promise((resolve) => window.setTimeout(resolve, 1400));
    if (!this.running) await ctx.suspend();
  }

  /** 0–1: the forge chapter turns the fire up. */
  setHeat(value: number): void {
    this.heat = Math.max(0, Math.min(1, value));
    const ctx = this.ctx;
    if (ctx && this.fire) this.fire.gain.setTargetAtTime(0.55 + this.heat * 0.6, ctx.currentTime, 1.2);
  }
}
