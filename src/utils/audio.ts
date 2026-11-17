// Gerenciamento de efeitos sonoros e música de fundo (BGM)
class BackgroundMusic {
  private audio: HTMLAudioElement | null = null
  private isMuted: boolean = false

  constructor() {
    const saved = localStorage.getItem('d64_music_muted')
    this.isMuted = saved === 'true'
  }

  public init() {
    if (typeof window === 'undefined') return
    if (!this.audio) {
      const baseUrl = import.meta.env.BASE_URL || '/'
      const musicPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}background_music.mp3`
      this.audio = new Audio(musicPath)
      this.audio.loop = true
      this.audio.volume = 0.15 // Volume suave de fundo para não atrapalhar
    }

    if (!this.isMuted) {
      this.play()
    }
  }

  public play() {
    if (!this.audio || this.isMuted) return
    this.audio.play().catch(() => {
      // Bloqueio de autoplay do navegador: inicia no primeiro toque/clique do usuário
      const startOnInteraction = () => {
        if (!this.isMuted && this.audio) {
          this.audio.play().catch(() => {})
        }
        window.removeEventListener('click', startOnInteraction)
        window.removeEventListener('touchstart', startOnInteraction)
        window.removeEventListener('keydown', startOnInteraction)
      }
      window.addEventListener('click', startOnInteraction, { once: true })
      window.addEventListener('touchstart', startOnInteraction, { once: true })
      window.addEventListener('keydown', startOnInteraction, { once: true })
    })
  }

  public pause() {
    if (this.audio) {
      this.audio.pause()
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    localStorage.setItem('d64_music_muted', String(this.isMuted))
    if (this.isMuted) {
      this.pause()
    } else {
      if (!this.audio) {
        this.init()
      } else {
        this.audio.volume = 0.15
        this.audio.play().catch(() => {})
      }
    }
    return this.isMuted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }
}

export const bgMusic = new BackgroundMusic()

class SoundManager {
  private muted: boolean = true

  public setMuted(muted: boolean) {
    this.muted = muted
  }

  public isMuted() {
    return this.muted
  }

  public playMove() {}
  public playCapture() {}
  public playCheck() {}
  public playFallenCannon() {}
}

export const soundManager = new SoundManager()
