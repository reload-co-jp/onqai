import Link from "next/link"
import { FC } from "react"

// C4〜B4 の周波数。図版の波の細かさは実際の周波数比に比例
const SCALE = [
  { label: "C4", hz: 261.63 },
  { label: "D4", hz: 293.66 },
  { label: "E4", hz: 329.63 },
  { label: "F4", hz: 349.23 },
  { label: "G4", hz: 392.0 },
  { label: "A4", hz: 440.0 },
  { label: "B4", hz: 493.88 },
]

const W = 360
const ROW = 44
const AMP = 11

const wavePath = (hz: number, y: number) => {
  const cycles = (hz / SCALE[0].hz) * 3
  const points: string[] = []
  for (let x = 0; x <= W; x += 2) {
    const v = Math.sin((x / W) * cycles * Math.PI * 2)
    points.push(`${x},${(y + v * AMP).toFixed(2)}`)
  }
  return `M${points.join(" L")}`
}

const ScaleChart: FC = () => (
  <figure style={{ borderTop: "1px solid var(--rule)", paddingTop: ".75rem" }}>
    <svg
      viewBox={`-44 0 ${W + 100} ${SCALE.length * ROW + 8}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="C4からB4までの音の波形と周波数"
    >
      {SCALE.map(({ label, hz }, i) => {
        const y = i * ROW + ROW / 2 + 4
        const isA = label === "A4"
        const color = isA ? "var(--accent)" : "var(--text)"
        return (
          <g key={label}>
            <line
              x1={0}
              x2={W}
              y1={y}
              y2={y}
              strokeWidth=".5"
              style={{ stroke: "var(--border)" }}
            />
            <text
              x={-44}
              y={y + 4}
              fontSize="11"
              style={{ fill: color, fontFamily: "var(--font-mono)" }}
            >
              {label}
            </text>
            <path
              d={wavePath(hz, y)}
              fill="none"
              strokeWidth={isA ? 1.6 : 0.9}
              style={{ stroke: color }}
            />
            <text
              x={W + 56}
              y={y + 4}
              fontSize="10"
              textAnchor="end"
              style={{
                fill: isA ? "var(--accent)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {hz.toFixed(hz % 1 ? 2 : 0)}Hz
            </text>
          </g>
        )
      })}
    </svg>
    <figcaption
      className="mono"
      style={{
        fontSize: ".625rem",
        color: "var(--text-muted)",
        marginTop: ".5rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>Fig.01 — C Major Scale</span>
      <span>A4 = 440Hz</span>
    </figcaption>
  </figure>
)

export const Hero: FC = () => (
  <section
    className="hero-grid"
    style={{
      padding:
        "calc(var(--section) * .5) var(--gutter) calc(var(--section) * .7)",
      borderBottom: "1px solid var(--rule)",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <p
        className="mono"
        style={{
          display: "flex",
          gap: "1.25rem",
          flexWrap: "wrap",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ color: "var(--accent)" }}>● Ear Training</span>
        <span>Vol.01</span>
        <span>Free / Web</span>
      </p>

      <h1
        className="hero-title"
        style={{
          fontSize: "clamp(3rem, 16vw, 6.5rem)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
        }}
      >
        音当て
        <br />
        ゲーム
      </h1>

      <p
        style={{
          fontSize: "clamp(1.25rem, 3vw, 2rem)",
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        音を聴く。
        <span style={{ color: "var(--accent)" }}>違いを知る。</span>
      </p>

      <p style={{ color: "var(--text-muted)", maxWidth: "30em" }}>
        再生された単音を聴いて、どの音階か当てる音感トレーニング。
        音色を変えると、同じ音階でも聞こえ方が変わります。
      </p>

      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="#game"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".75rem",
            padding: "1rem 1.75rem",
            background: "var(--text)",
            color: "var(--paper)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>
            ▶
          </span>
          ゲームを始める
        </Link>
        <Link
          href="#index"
          className="nav-link mono"
          style={{ fontSize: ".75rem" }}
        >
          All Contents ↓
        </Link>
      </div>

      <p
        className="mono"
        style={{ fontSize: ".6875rem", color: "var(--text-faint)" }}
      >
        ※ 音量にご注意ください / 音は自動再生されません
      </p>
    </div>

    <ScaleChart />
  </section>
)
