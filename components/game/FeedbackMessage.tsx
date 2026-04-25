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
        padding: ".75rem 1rem",
        borderRadius: ".5rem",
        backgroundColor: isCorrect ? "#1a4731" : "#4c1a1a",
        border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
        color: isCorrect ? "#86efac" : "#fca5a5",
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      {isCorrect
        ? `正解！ ${currentNote.id} でした`
        : `不正解。正解は ${currentNote.id} でした`}
    </div>
  )
}
