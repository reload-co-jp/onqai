import Link from "next/link"
import { FC } from "react"

const CREDITS = [
  ["Listen", "聴く", "単音・旋律・和音を、繰り返し聴く。"],
  ["Compare", "比べる", "音色や音程の違いを、耳で確かめる。"],
  ["Sing", "歌う", "マイクで自分の声の高さを測る。"],
]

export const AboutTeaser: FC = () => (
  <section
    aria-labelledby="about-title"
    className="about-grid"
    style={{
      padding: "var(--section) var(--gutter)",
      borderTop: "1px solid var(--rule)",
      background: "var(--text)",
      color: "var(--paper)",
    }}
  >
    <div>
      <p
        className="mono"
        style={{ color: "var(--accent)", marginBottom: "1rem" }}
      >
        About — Liner Notes
      </p>
      <h2
        id="about-title"
        style={{
          fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
          fontWeight: 900,
          lineHeight: 1.2,
        }}
      >
        耳のための、
        <br />
        小さな実験室。
      </h2>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <p style={{ opacity: 0.85, maxWidth: "34em" }}>
        ONQAI は、音を聴き分ける力を育てるための無料の音感トレーニングです。
        音痴の多くは生まれつきではなく、音を正確に聴く習慣の問題。
        遊びながら、少しずつ耳をひらいていきます。
      </p>
      <dl style={{ borderTop: "1px solid currentColor" }}>
        {CREDITS.map(([en, ja, text]) => (
          <div
            key={en}
            style={{
              display: "grid",
              gridTemplateColumns: "7rem 1fr",
              gap: "1rem",
              padding: ".75rem 0",
              borderBottom: "1px solid rgba(243, 240, 233, .25)",
            }}
          >
            <dt className="mono">
              {en} <span style={{ opacity: 0.6 }}>/ {ja}</span>
            </dt>
            <dd style={{ margin: 0, fontSize: ".9375rem", opacity: 0.85 }}>
              {text}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href="/about"
        className="mono"
        style={{ color: "var(--paper)", alignSelf: "flex-start" }}
      >
        Read More — このアプリについて →
      </Link>
    </div>
  </section>
)
