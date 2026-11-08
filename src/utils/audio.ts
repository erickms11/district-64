class SoundManager {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    // Loaded lazily on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted
  }

  public isMuted() {
    return this.muted
  }

  // Regular piece move sound: subtle wood drop
  public playMove() {
    if (this.muted) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Audio not permitted yet or unsupported
    }
  }

  // Capture piece sound: heavier wooden impact
  public playCapture() {
    if (this.muted) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(260, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.14)

      gain.gain.setValueAtTime(0.5, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.14)
    } catch {
      // ignore
    }
  }

  // Check alert: sharp chime
  public playCheck() {
    if (this.muted) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(600, this.ctx.currentTime)
      osc.frequency.setValueAtTime(850, this.ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.25)
    } catch {
      // ignore
    }
  }

  // The Hunger Games Tribute Cannon: deep booming resonance when a tribute falls
  public playFallenCannon() {
    if (this.muted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      // Cannon boom: low frequency noise burst
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(110, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.2)

      gain.gain.setValueAtTime(0.8, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 1.2)
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager()

