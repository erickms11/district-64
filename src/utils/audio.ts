class SoundManager {
  private muted: boolean = true // Desativado a pedido do usuário

  public setMuted(muted: boolean) {
    this.muted = muted
  }

  public isMuted() {
    return this.muted
  }

  public playMove() {
    // Silenciado
  }

  public playCapture() {
    // Silenciado
  }

  public playCheck() {
    // Silenciado
  }

  public playFallenCannon() {
    // Silenciado
  }
}

export const soundManager = new SoundManager()
