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

// 鍵盤は幅いっぱいに伸縮。黒鍵幅は白鍵の6割
const WHITE_PCT = 100 / WHITE_KEYS.length
const BLACK_PCT = WHITE_PCT * 0.6

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

    if ((isLastAnswer && lastResult === "correct") || isCorrectHint) {
      return { bg: "var(--success)", color: "var(--paper)" }
    }
    if (isLastAnswer && lastResult === "wrong") {
      return { bg: "var(--error)", color: "var(--paper)" }
    }
    if (!available) {
      return {
        bg: isWhite
          ? "repeating-linear-gradient(-45deg, var(--surface) 0 4px, var(--paper) 4px 8px)"
          : "var(--text-muted)",
        color: "var(--text-faint)",
      }
    }
    return {
      bg: isWhite ? "var(--paper)" : "var(--text)",
      color: isWhite ? "var(--text)" : "var(--paper)",
    }
  }

  return (
    <div
      className="piano"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "36rem",
        height: "clamp(9rem, 28vw, 12rem)",
        borderTop: "4px solid var(--rule)",
      }}
    >
      {WHITE_KEYS.map((key, i) => {
        const { bg, color } = resolveColors(key.id, true)
        const available = noteIds.has(key.id)
        return (
          <button
            key={key.id}
            onClick={() => !disabled && available && onAnswer(key.id)}
            disabled={disabled || !available}
            aria-label={`${key.label}（${key.solfege}）で回答`}
            style={{
              position: "absolute",
              left: `${i * WHITE_PCT}%`,
              top: 0,
              width: `calc(${WHITE_PCT}% + 1px)`,
              height: "100%",
              background: bg,
              border: "1px solid var(--rule)",
              borderTop: "none",
              borderRadius: 0,
              cursor: disabled || !available ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: ".625rem",
              gap: ".125rem",
              color,
              fontSize: ".9375rem",
              fontWeight: "bold",
              zIndex: 1,
            }}
          >
            <span>{key.label}</span>
            <span style={{ fontSize: ".6875rem", fontWeight: "normal" }}>
              {key.solfege}
            </span>
          </button>
        )
      })}

      {BLACK_KEYS.map((key) => {
        const { bg, color } = resolveColors(key.id, false)
        const available = noteIds.has(key.id)
        return (
          <button
            key={key.id}
            onClick={() => !disabled && available && onAnswer(key.id)}
            disabled={disabled || !available}
            aria-label={`${key.label}（${key.solfege}）で回答`}
            style={{
              position: "absolute",
              left: `${(key.afterWhiteIdx + 1) * WHITE_PCT - BLACK_PCT / 2}%`,
              top: 0,
              width: `${BLACK_PCT}%`,
              height: "60%",
              background: bg,
              border: "1px solid var(--rule)",
              borderTop: "none",
              borderRadius: 0,
              cursor: disabled || !available ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: ".375rem",
              gap: ".0625rem",
              color,
              fontSize: ".625rem",
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
  )
}
