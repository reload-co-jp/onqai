let audioContext: AudioContext | null = null
let analyserNode: AnalyserNode | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
    analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = 2048
    analyserNode.connect(audioContext.destination)
  }
  if (audioContext.state === "suspended") {
    audioContext.resume()
  }
  return audioContext
}

export function getAnalyser(): AnalyserNode | null {
  return analyserNode
}

export function playTone(params: {
  frequency: number
  type: OscillatorType
  duration?: number
  volume?: number
}): void {
  const { frequency, type, duration = 1, volume = 0.3 } = params
  const ctx = getAudioContext()

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(analyserNode!)

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
  gainNode.gain.setValueAtTime(volume, ctx.currentTime + duration - 0.05)
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}
