"use client"
import { FC } from "react"
import type { Difficulty } from "types/game"

const DIFFICULTIES: {
  value: Difficulty
  label: string
  description: string
}[] = [
  { value: "easy", label: "初級", description: "C D E F G" },
  { value: "normal", label: "中級", description: "白鍵1オクターブ" },
  { value: "hard", label: "上級", description: "半音を含む" },
]

type Props = {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
}

export const DifficultySelector: FC<Props> = ({ value, onChange }) => (
  <div role="group" aria-labelledby="difficulty-label">
    <p
      id="difficulty-label"
      className="mono"
      style={{
        color: "var(--text-muted)",
        borderBottom: "1px solid var(--rule)",
        paddingBottom: ".375rem",
        marginBottom: ".5rem",
      }}
    >
      Level / 難易度
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
      {DIFFICULTIES.map((diff, i) => {
        const active = value === diff.value
        return (
          <button
            key={diff.value}
            onClick={() => onChange(diff.value)}
            aria-pressed={active}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: ".75rem",
              textAlign: "left",
              padding: ".625rem .75rem",
              minHeight: "2.75rem",
              borderRadius: 0,
              border: `1px solid ${active ? "var(--rule)" : "var(--border)"}`,
              backgroundColor: active ? "var(--text)" : "var(--paper)",
              color: active ? "var(--paper)" : "var(--text)",
              fontSize: ".9375rem",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".6875rem",
                fontWeight: 400,
                color: active ? "var(--accent)" : "var(--text-faint)",
              }}
            >
              Lv.{i + 1}
            </span>
            {diff.label}
            <span
              style={{
                fontSize: ".75rem",
                fontWeight: 400,
                color: active ? "var(--paper)" : "var(--text-muted)",
                opacity: active ? 0.75 : 1,
                marginLeft: "auto",
              }}
            >
              {diff.description}
            </span>
          </button>
        )
      })}
    </div>
  </div>
)
