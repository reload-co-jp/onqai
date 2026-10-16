import { FC } from "react"
import type { Note } from "types/game"

type Props = {
  result: "correct" | "wrong" | null
  currentNote: Note | null
}

export const FeedbackMessage: FC<Props> = ({ result, currentNote }) => {
  if (!result || !currentNote) return null

  const isCorrect = result === "correct"

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: ".875rem 1rem",
        backgroundColor: isCorrect ? "var(--success)" : "var(--error)",
        color: "var(--paper)",
        fontSize: "1.0625rem",
        fontWeight: "bold",
        animation: `${isCorrect ? "pop" : "shake"} .3s ease-out`,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "1.5rem", lineHeight: 1 }}>
        {isCorrect ? "○" : "×"}
      </span>
      {isCorrect
        ? `正解！ ${currentNote.id} でした`
        : `不正解。正解は ${currentNote.id} でした`}
    </div>
  )
}
