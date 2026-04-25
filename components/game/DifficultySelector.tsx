"use client"
import { FC } from "react"
import type { Difficulty } from "types/game"

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "easy", label: "初級", description: "C D E F G" },
  { value: "normal", label: "中級", description: "白鍵1オクターブ" },
  { value: "hard", label: "上級", description: "半音を含む" },
]

type Props = {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
}

export const DifficultySelector: FC<Props> = ({ value, onChange }) => (
  <div>
    <p style={{ fontSize: ".875rem", marginBottom: ".5rem", color: "#aaa" }}>難易度</p>
    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
      {DIFFICULTIES.map((diff) => (
        <button
          key={diff.value}
          onClick={() => onChange(diff.value)}
          aria-pressed={value === diff.value}
          style={{
            padding: ".375rem .75rem",
            borderRadius: ".375rem",
            border: `1px solid ${value === diff.value ? "#7c6bf0" : "#555"}`,
            backgroundColor: value === diff.value ? "#2d2460" : "transparent",
            color: "#f0f0f0",
            cursor: "pointer",
            fontSize: ".875rem",
          }}
        >
          {diff.label}
          <span style={{ fontSize: ".75rem", color: "#aaa", marginLeft: ".375rem" }}>
            {diff.description}
          </span>
        </button>
      ))}
    </div>
  </div>
)
