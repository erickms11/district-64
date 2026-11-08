class HapticManager {
  private enabled: boolean = true

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  public isEnabled() {
    return this.enabled
  }

  // Subtle tap on normal move
  public move() {
    if (!this.enabled || typeof window === 'undefined' || !navigator.vibrate) return
    try {
      navigator.vibrate(12)
    } catch {
      // Haptics not allowed or unsupported
    }
  }

  // Stronger feedback on capture
  public capture() {
    if (!this.enabled || typeof window === 'undefined' || !navigator.vibrate) return
    try {
      navigator.vibrate(28)
    } catch {
      // ignore
    }
  }

  // Double pulse on check alert
  public check() {
    if (!this.enabled || typeof window === 'undefined' || !navigator.vibrate) return
    try {
      navigator.vibrate([35, 50, 35])
    } catch {
      // ignore
    }
  }

  // Canon / Victory pattern
  public fallen() {
    if (!this.enabled || typeof window === 'undefined' || !navigator.vibrate) return
    try {
      navigator.vibrate([60, 60, 60, 60, 140])
    } catch {
      // ignore
    }
  }
}

export const haptics = new HapticManager()

