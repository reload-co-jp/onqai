import { FC } from "react"

type Props = {
  correctCount: number
  totalCount: number
  streak: number
  limit?: number
}

export const ScoreBoard: FC<Props> = ({
  correctCount,
  totalCount,
  streak,
  limit,
}) => {
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  const stats = [
    { en: "Score", ja: "スコア", value: `${correctCount}/${totalCount}` },
    { en: "Accuracy", ja: "正答率", value: `${accuracy}%` },
    { en: "Streak", ja: "連続正解", value: String(streak) },
  ]

  return (
    <div
      style={{
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {stats.map(({ en, ja, value }, i) => (
          <div
            key={en}
            style={{
              padding: ".75rem .75rem .75rem 0",
              paddingLeft: i === 0 ? 0 : ".75rem",
              borderLeft: i === 0 ? "none" : "1px solid var(--border)",
            }}
          >
            <dt
              className="mono"
              style={{ fontSize: ".625rem", color: "var(--text-muted)" }}
            >
              {en}
              <span style={{ display: "block", letterSpacing: 0 }}>{ja}</span>
            </dt>
            <dd
              style={{
                margin: 0,
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.2,
                color:
                  en === "Streak" && streak >= 3 ? "var(--accent)" : undefined,
              }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {limit && (
        <div
          aria-hidden="true"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${limit}, 1fr)`,
            gap: "3px",
            paddingBottom: ".75rem",
          }}
        >
          {Array.from({ length: limit }, (_, i) => (
            <span
              key={i}
              style={{
                height: ".375rem",
                background: i < totalCount ? "var(--text)" : "var(--border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
