// Autocorrelation-based pitch detection for vocal/microphone input
// Search range: 80Hz–1200Hz (covers singing voice and whistling)

export function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length

  // RMS silence gate
  let sum = 0
  for (let i = 0; i < SIZE; i++) sum += buffer[i] * buffer[i]
  if (Math.sqrt(sum / SIZE) < 0.015) return null

  const minPeriod = Math.floor(sampleRate / 1200)
  const maxPeriod = Math.ceil(sampleRate / 80)

  let maxCorr = -Infinity
  let maxPos = -1

  for (let lag = minPeriod; lag <= maxPeriod && lag < SIZE; lag++) {
    let corr = 0
    const count = SIZE - lag
    for (let j = 0; j < count; j++) {
      corr += buffer[j] * buffer[j + lag]
    }
    if (corr > maxCorr) {
      maxCorr = corr
      maxPos = lag
    }
  }

  if (maxPos <= minPeriod) return null

  // Parabolic interpolation for sub-sample accuracy
  const y1 = maxPos > 0 ? (maxPos - 1 < SIZE - maxPos ? autocorr(buffer, maxPos - 1, SIZE) : maxCorr) : maxCorr
  const y2 = maxCorr
  const y3 = maxPos + 1 <= maxPeriod && maxPos + 1 < SIZE - (maxPos + 1)
    ? autocorr(buffer, maxPos + 1, SIZE)
    : maxCorr

  const denom = y1 + y3 - 2 * y2
  const refined = denom !== 0 ? maxPos - (y3 - y1) / (2 * denom) : maxPos

  return sampleRate / refined
}

function autocorr(buffer: Float32Array, lag: number, size: number): number {
  let c = 0
  const count = size - lag
  for (let j = 0; j < count; j++) c += buffer[j] * buffer[j + lag]
  return c
}

// Frequency → nearest note name + cents offset
const A4 = 440
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export function freqToNote(freq: number): { name: string; octave: number; cents: number } {
  const semitones = 12 * Math.log2(freq / A4)
  const nearest = Math.round(semitones)
  const cents = Math.round((semitones - nearest) * 100)
  const noteIndex = ((nearest % 12) + 12 + 9) % 12 // A4 is index 9
  const octave = 4 + Math.floor((nearest + 9) / 12)
  return { name: NOTE_NAMES[noteIndex], octave, cents }
}

export function centsFromTarget(detectedFreq: number, targetFreq: number): number {
  return Math.round(1200 * Math.log2(detectedFreq / targetFreq))
}
