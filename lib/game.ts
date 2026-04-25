import type { Note, Difficulty } from "types/game"
import { NOTES, NOTES_HARD } from "lib/notes"

const EASY_NOTE_IDS = ["C4", "D4", "E4", "F4", "G4"]

export function getRandomNote(notes: Note[]): Note {
  return notes[Math.floor(Math.random() * notes.length)]
}

export function judgeAnswer(answer: string, currentNote: Note): boolean {
  return answer === currentNote.id
}

export function getNotesByDifficulty(difficulty: Difficulty): Note[] {
  switch (difficulty) {
    case "easy":
      return NOTES.filter((n) => EASY_NOTE_IDS.includes(n.id))
    case "normal":
      return NOTES
    case "hard":
      return NOTES_HARD
  }
}
