import { FC } from "react"

type Props = {
  correctCount: number
  totalCount: number
  streak: number
}

export const ScoreBoard: FC<Props> = ({ correctCount, totalCount, streak }) => {
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        padding: ".75rem 1rem",
        backgroundColor: "#2a2a2a",
        borderRadius: ".5rem",
        border: "1px solid #444",
        flexWrap: "wrap",
      }}
    >
      <div>
        <p style={{ color: "#aaa", fontSize: ".75rem" }}>スコア</p>
        <p style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
          {correctCount} / {totalCount}
        </p>
      </div>
      <div>
        <p style={{ color: "#aaa", fontSize: ".75rem" }}>正答率</p>
        <p style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{accuracy}%</p>
      </div>
      <div>
        <p style={{ color: "#aaa", fontSize: ".75rem" }}>連続正解</p>
        <p style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{streak}</p>
      </div>
    </div>
  )
}
