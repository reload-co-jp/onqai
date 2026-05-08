export type MelodyNoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B" | "C5"

export type Melody = {
  id: string
  title: string
  origin: string
  notes: MelodyNoteName[]
  durations: number[]
}

export const MELODY_NOTE_LABELS: Record<MelodyNoteName, string> = {
  C: "ド",
  D: "レ",
  E: "ミ",
  F: "ファ",
  G: "ソ",
  A: "ラ",
  B: "シ",
  C5: "ド",
}

export const MELODY_NOTE_FREQUENCIES: Record<MelodyNoteName, number> = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
  C5: 523.25,
}

export const MELODIES: Melody[] = [
  {
    id: "sakura",
    title: "さくらさくら",
    origin: "日本古謡",
    notes: ["A", "A", "B", "A", "A", "B", "A", "B", "C5", "B", "A", "B", "A"],
    durations: [1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2],
  },
  {
    id: "usagi",
    title: "うさぎ",
    origin: "日本民謡",
    notes: ["A", "B", "C5", "B", "A", "B", "A"],
    durations: [1, 1, 2, 1, 1, 1, 3],
  },
  {
    id: "kagome",
    title: "かごめかごめ",
    origin: "わらべうた",
    notes: ["G", "G", "A", "G", "E", "G", "A", "G"],
    durations: [1, 1, 1, 1, 2, 1, 1, 2],
  },
  {
    id: "hotaru",
    title: "ほたるこい",
    origin: "わらべうた",
    notes: ["G", "E", "G", "A", "G", "E", "D", "E"],
    durations: [1, 1, 1, 1, 1, 1, 1, 2],
  },
  {
    id: "kaeru",
    title: "かえるの合唱",
    origin: "童謡",
    notes: ["C", "D", "E", "F", "E", "D", "C"],
    durations: [1, 1, 1, 1, 1, 1, 2],
  },
]

export function melodyAnswer(melody: Melody): string {
  return melody.notes.map((note) => MELODY_NOTE_LABELS[note]).join(" ")
}
