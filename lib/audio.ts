let audioContext: AudioContext | null = null
let analyserNode: AnalyserNode | null = null

type InstrumentToneType = "piano" | "organ" | "guitar" | "trumpet" | "oboe" | "voice"

type InstrumentConfig = {
  oscillatorType: OscillatorType
  harmonics: { multiple: number; gain: number; detune?: number }[]
  attack: number
  decay: number
  sustain: number
  release: number
  vibrato?: { rate: number; depth: number }
}

const INSTRUMENTS: Record<InstrumentToneType, InstrumentConfig> = {
  piano: {
    oscillatorType: "triangle",
    harmonics: [
      { multiple: 1, gain: 1 },
      { multiple: 2, gain: 0.42, detune: 3 },
      { multiple: 3, gain: 0.22, detune: 5 },
      { multiple: 4, gain: 0.12, detune: 7 },
    ],
    attack: 0.012,
    decay: 0.18,
    sustain: 0.28,
    release: 0.08,
  },
  organ: {
    oscillatorType: "sine",
    harmonics: [
      { multiple: 1, gain: 1 },
      { multiple: 2, gain: 0.55 },
      { multiple: 3, gain: 0.28 },
      { multiple: 4, gain: 0.18 },
    ],
    attack: 0.04,
    decay: 0.05,
    sustain: 0.92,
    release: 0.08,
  },
  guitar: {
    oscillatorType: "triangle",
    harmonics: [
      { multiple: 1, gain: 1 },
      { multiple: 2, gain: 0.34, detune: -4 },
      { multiple: 3, gain: 0.2, detune: 4 },
      { multiple: 5, gain: 0.08 },
    ],
    attack: 0.008,
    decay: 0.14,
    sustain: 0.16,
    release: 0.05,
  },
  trumpet: {
    oscillatorType: "sawtooth",
    harmonics: [
      { multiple: 1, gain: 0.9 },
      { multiple: 2, gain: 0.62 },
      { multiple: 3, gain: 0.42 },
      { multiple: 4, gain: 0.24 },
      { multiple: 5, gain: 0.14 },
    ],
    attack: 0.08,
    decay: 0.08,
    sustain: 0.74,
    release: 0.08,
    vibrato: { rate: 5.6, depth: 7 },
  },
  oboe: {
    oscillatorType: "sine",
    harmonics: [
      { multiple: 1, gain: 1 },
      { multiple: 2, gain: 0.22 },
      { multiple: 3, gain: 0.68 },
      { multiple: 4, gain: 0.2 },
      { multiple: 5, gain: 0.32 },
    ],
    attack: 0.06,
    decay: 0.06,
    sustain: 0.72,
    release: 0.08,
    vibrato: { rate: 5.2, depth: 5 },
  },
  voice: {
    oscillatorType: "sine",
    harmonics: [
      { multiple: 1, gain: 1 },
      { multiple: 2, gain: 0.48 },
      { multiple: 3, gain: 0.24 },
      { multiple: 4, gain: 0.1 },
    ],
    attack: 0.09,
    decay: 0.12,
    sustain: 0.7,
    release: 0.12,
    vibrato: { rate: 5.8, depth: 11 },
  },
}

function isInstrumentTone(type: OscillatorType | InstrumentToneType): type is InstrumentToneType {
  return type in INSTRUMENTS
}

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
  type: OscillatorType | InstrumentToneType
  duration?: number
  volume?: number
}): void {
  const { frequency, type, duration = 1, volume = 0.3 } = params
  const ctx = getAudioContext()

  if (isInstrumentTone(type)) {
    playInstrumentTone(ctx, frequency, type, duration, volume)
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

function playInstrumentTone(
  ctx: AudioContext,
  frequency: number,
  type: InstrumentToneType,
  duration: number,
  volume: number
): void {
  const now = ctx.currentTime
  const config = INSTRUMENTS[type]
  const output = ctx.createGain()
  const releaseStart = Math.max(now + config.attack + config.decay, now + duration - config.release)
  let lfoGain: GainNode | null = null

  output.connect(analyserNode!)
  output.gain.setValueAtTime(0, now)
  output.gain.linearRampToValueAtTime(volume, now + config.attack)
  output.gain.exponentialRampToValueAtTime(
    Math.max(volume * config.sustain, 0.001),
    now + config.attack + config.decay
  )
  output.gain.setValueAtTime(Math.max(volume * config.sustain, 0.001), releaseStart)
  output.gain.exponentialRampToValueAtTime(0.001, now + duration)

  if (config.vibrato) {
    const lfo = ctx.createOscillator()
    lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(config.vibrato.rate, now)
    lfoGain.gain.setValueAtTime(config.vibrato.depth, now)
    lfo.connect(lfoGain)
    lfo.start(now)
    lfo.stop(now + duration)
  }

  config.harmonics.forEach(({ multiple, gain, detune = 0 }) => {
    const oscillator = ctx.createOscillator()
    const partialGain = ctx.createGain()

    oscillator.type = config.oscillatorType
    oscillator.frequency.setValueAtTime(frequency * multiple, now)
    oscillator.detune.setValueAtTime(detune, now)
    partialGain.gain.setValueAtTime(gain, now)

    if (lfoGain) lfoGain.connect(oscillator.detune)
    oscillator.connect(partialGain)
    partialGain.connect(output)
    oscillator.start(now)
    oscillator.stop(now + duration)
  })
}
