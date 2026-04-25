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

const WHITE_KEYS = [
  { id: "C4", label: "C", solfege: "ド" },
  { id: "D4", label: "D", solfege: "レ" },
  { id: "E4", label: "E", solfege: "ミ" },
  { id: "F4", label: "F", solfege: "ファ" },
  { id: "G4", label: "G", solfege: "ソ" },
  { id: "A4", label: "A", solfege: "ラ" },
  { id: "B4", label: "B", solfege: "シ" },
]

const BLACK_KEYS = [
  { id: "Cs4", label: "C#", solfege: "ド#", afterWhiteIdx: 0 },
  { id: "Ds4", label: "D#", solfege: "レ#", afterWhiteIdx: 1 },
  { id: "Fs4", label: "F#", solfege: "ファ#", afterWhiteIdx: 3 },
  { id: "Gs4", label: "G#", solfege: "ソ#", afterWhiteIdx: 4 },
  { id: "As4", label: "A#", solfege: "ラ#", afterWhiteIdx: 5 },
]

const W = 52
const H = 160
const BW = 32
const BH = 98

export const PianoKeyboard: FC<Props> = ({
  notes,
  onAnswer,
  disabled,
  lastAnswer,
  lastResult,
  currentNote,
}) => {
  const noteIds = new Set(notes.map((n) => n.id))

  const resolveColors = (id: string, isWhite: boolean) => {
    const isLastAnswer = lastAnswer === id
    const isCorrectHint = lastResult === "wrong" && currentNote?.id === id
    const available = noteIds.has(id)

    if (isLastAnswer && lastResult === "correct") {
      return { bg: "#1a4731", border: "#22c55e", color: "#22c55e" }
    }
    if (isLastAnswer && lastResult === "wrong") {
      return { bg: "#4c1a1a", border: "#ef4444", color: "#ef4444" }
    }
    if (isCorrectHint) {
      return { bg: "#1a4731", border: "#22c55e", color: "#22c55e" }
    }
    if (!available) {
      return { bg: isWhite ? "#4a4a4a" : "#2a2a2a", border: "#3a3a3a", color: "#555" }
    }
    return {
      bg: isWhite ? "#e8e8e8" : "#222",
      border: "#555",
      color: isWhite ? "#333" : "#ccc",
    }
  }

  return (
    <div style={{ overflowX: "auto", paddingBottom: ".5rem" }}>
      <div style={{ position: "relative", width: WHITE_KEYS.length * W, height: H, flexShrink: 0 }}>
        {WHITE_KEYS.map((key, i) => {
          const { bg, border, color } = resolveColors(key.id, true)
          const available = noteIds.has(key.id)
          return (
            <button
              key={key.id}
              onClick={() => !disabled && available && onAnswer(key.id)}
              disabled={disabled || !available}
              style={{
                position: "absolute",
                left: i * W,
                top: 0,
                width: W - 2,
                height: H,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                borderRadius: "0 0 .375rem .375rem",
                cursor: disabled || !available ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: ".5rem",
                gap: ".125rem",
                color,
                fontSize: ".75rem",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              <span>{key.label}</span>
              <span style={{ fontSize: ".625rem", fontWeight: "normal" }}>{key.solfege}</span>
            </button>
          )
        })}

        {BLACK_KEYS.map((key) => {
          const { bg, border, color } = resolveColors(key.id, false)
          const available = noteIds.has(key.id)
          const left = (key.afterWhiteIdx + 1) * W - BW / 2 - 1
          return (
            <button
              key={key.id}
              onClick={() => !disabled && available && onAnswer(key.id)}
              disabled={disabled || !available}
              style={{
                position: "absolute",
                left,
                top: 0,
                width: BW,
                height: BH,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                borderRadius: "0 0 .25rem .25rem",
                cursor: disabled || !available ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: ".25rem",
                gap: ".0625rem",
                color,
                fontSize: ".5rem",
                fontWeight: "bold",
                zIndex: 2,
              }}
            >
              {available && (
                <>
                  <span>{key.label}</span>
                  <span style={{ fontWeight: "normal" }}>{key.solfege}</span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
