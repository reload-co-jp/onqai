"use client"
import { FC } from "react"
import type { Note } from "types/game"

type Props = {
  notes: Note[]
  onAnswer: (noteId: string) => void
  disabled: boolean
  lastAnswer: string | null
  lastResult: "correct" | "wrong" | null
  currentNote: Note | null
}

export const AnswerButtons: FC<Props> = ({
  notes,
  onAnswer,
  disabled,
  lastAnswer,
  lastResult,
  currentNote,
}) => (
  <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
    {notes.map((note) => {
      const isLastAnswer = lastAnswer === note.id
      const isCorrectNote = lastResult === "wrong" && currentNote?.id === note.id

      let borderColor = "#555"
      let bgColor = "#3a3a3a"

      if (isLastAnswer && lastResult === "correct") {
        borderColor = "#22c55e"
        bgColor = "#1a4731"
      } else if (isLastAnswer && lastResult === "wrong") {
        borderColor = "#ef4444"
        bgColor = "#4c1a1a"
      } else if (isCorrectNote) {
        borderColor = "#22c55e"
        bgColor = "#1a4731"
      }

      return (
        <button
          key={note.id}
          onClick={() => onAnswer(note.id)}
          disabled={disabled}
          aria-label={`${note.label}で回答`}
          style={{
            padding: ".75rem 1.25rem",
            borderRadius: ".5rem",
            border: `2px solid ${borderColor}`,
            backgroundColor: bgColor,
            color: "#f0f0f0",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "1.125rem",
            fontWeight: "bold",
            minWidth: "3.5rem",
            opacity: disabled && !isLastAnswer && !isCorrectNote ? 0.5 : 1,
          }}
        >
          {note.label}
        </button>
      )
    })}
  </div>
)
