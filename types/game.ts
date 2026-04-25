export type OscillatorWaveType = "sine" | "square" | "sawtooth" | "triangle"

export type Note = {
  id: string
  label: string
  solfege: string
  frequency: number
}

export type Difficulty = "easy" | "normal" | "hard"

export type GameState = {
  currentNote: Note | null
  selectedWaveType: OscillatorWaveType
  difficulty: Difficulty
  correctCount: number
  totalCount: number
  streak: number
  lastAnswer: string | null
  lastResult: "correct" | "wrong" | null
}
