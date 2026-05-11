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
  type: OscillatorType | "piano"
  duration?: number
  volume?: number
}): void {
  const { frequency, type, duration = 1, volume = 0.3 } = params
  const ctx = getAudioContext()

  if (type === "piano") {
    playPianoTone(ctx, frequency, duration, volume)
    return
  }

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

function playPianoTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number
): void {
  const now = ctx.currentTime
  const output = ctx.createGain()
  const harmonics = [
    { multiple: 1, gain: 1 },
    { multiple: 2, gain: 0.42 },
    { multiple: 3, gain: 0.22 },
    { multiple: 4, gain: 0.12 },
  ]

  output.connect(analyserNode!)
  output.gain.setValueAtTime(0, now)
  output.gain.linearRampToValueAtTime(volume, now + 0.012)
  output.gain.exponentialRampToValueAtTime(Math.max(volume * 0.28, 0.001), now + 0.18)
  output.gain.exponentialRampToValueAtTime(0.001, now + duration)

  harmonics.forEach(({ multiple, gain }) => {
    const oscillator = ctx.createOscillator()
    const partialGain = ctx.createGain()

    oscillator.type = "triangle"
    oscillator.frequency.setValueAtTime(frequency * multiple, now)
    oscillator.detune.setValueAtTime(multiple === 1 ? 0 : multiple * 1.5, now)
    partialGain.gain.setValueAtTime(gain, now)

    oscillator.connect(partialGain)
    partialGain.connect(output)
    oscillator.start(now)
    oscillator.stop(now + duration)
  })
}
