import type { Note } from "types/game"

export const NOTES: Note[] = [
  { id: "C4", label: "C", solfege: "ド", frequency: 261.63 },
  { id: "D4", label: "D", solfege: "レ", frequency: 293.66 },
  { id: "E4", label: "E", solfege: "ミ", frequency: 329.63 },
  { id: "F4", label: "F", solfege: "ファ", frequency: 349.23 },
  { id: "G4", label: "G", solfege: "ソ", frequency: 392.0 },
  { id: "A4", label: "A", solfege: "ラ", frequency: 440.0 },
  { id: "B4", label: "B", solfege: "シ", frequency: 493.88 },
]

export const NOTES_HARD: Note[] = [
  { id: "C4", label: "C", solfege: "ド", frequency: 261.63 },
  { id: "Cs4", label: "C#", solfege: "ド#", frequency: 277.18 },
  { id: "D4", label: "D", solfege: "レ", frequency: 293.66 },
  { id: "Ds4", label: "D#", solfege: "レ#", frequency: 311.13 },
  { id: "E4", label: "E", solfege: "ミ", frequency: 329.63 },
  { id: "F4", label: "F", solfege: "ファ", frequency: 349.23 },
  { id: "Fs4", label: "F#", solfege: "ファ#", frequency: 369.99 },
  { id: "G4", label: "G", solfege: "ソ", frequency: 392.0 },
  { id: "Gs4", label: "G#", solfege: "ソ#", frequency: 415.3 },
  { id: "A4", label: "A", solfege: "ラ", frequency: 440.0 },
  { id: "As4", label: "A#", solfege: "ラ#", frequency: 466.16 },
  { id: "B4", label: "B", solfege: "シ", frequency: 493.88 },
]
