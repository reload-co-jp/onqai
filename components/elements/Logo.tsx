import Link from "next/link"
import { FC } from "react"

export const Logo: FC = () => (
  <Link
    href="/"
    aria-label="ONQAI 音当てゲーム ホーム"
    style={{
      display: "flex",
      alignItems: "center",
      gap: ".625rem",
      textDecoration: "none",
    }}
  >
    {/* レコード盤を思わせる朱の円 */}
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="11" style={{ fill: "var(--accent)" }} />
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        style={{ stroke: "var(--paper)" }}
        strokeWidth=".75"
        opacity=".6"
      />
      <circle cx="11" cy="11" r="2.25" style={{ fill: "var(--paper)" }} />
    </svg>
    <span
      style={{
        fontSize: "1.25rem",
        fontWeight: 900,
        letterSpacing: ".02em",
        lineHeight: 1,
      }}
    >
      ONQAI
    </span>
    <span
      className="mono logo-sub"
      style={{
        fontSize: ".625rem",
        color: "var(--text-muted)",
        borderLeft: "1px solid var(--rule)",
        paddingLeft: ".625rem",
        lineHeight: 1.3,
      }}
    >
      音当て
      <br />
      Ear Lab
    </span>
  </Link>
)
