import Link from "next/link"
import { FC } from "react"
import { CATALOG } from "lib/catalog"
import { Logo } from "components/elements/Logo"
import { PwaInstallButton } from "components/elements/PwaInstallButton"

export const Footer: FC = () => (
  <footer
    style={{
      borderTop: "1px solid var(--rule)",
      padding: "3rem var(--gutter) 2rem",
      display: "grid",
      gap: "2.5rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Logo />
      <p style={{ fontSize: ".8125rem", color: "var(--text-muted)" }}>
        音を聴く。違いを知る。
        <br />
        耳のための小さな実験室。
      </p>
      <PwaInstallButton />
    </div>
    <nav aria-label="フッター">
      <p
        className="mono"
        style={{ color: "var(--text-faint)", marginBottom: ".75rem" }}
      >
        Index
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: ".375rem 1.5rem",
        }}
      >
        {CATALOG.map(({ no, href, title }) => (
          <li key={href}>
            <Link
              href={href}
              className="nav-link"
              style={{ fontSize: ".875rem", display: "flex", gap: ".5rem" }}
            >
              <span className="mono" style={{ color: "var(--text-faint)" }}>
                {no}
              </span>
              {title}
            </Link>
          </li>
        ))}
        <li style={{ gridColumn: "1 / -1" }}>
          <Link
            href="/about"
            className="nav-link"
            style={{ fontSize: ".875rem", display: "flex", gap: ".5rem" }}
          >
            <span className="mono" style={{ color: "var(--text-faint)" }}>
              ++
            </span>
            このアプリについて
          </Link>
        </li>
      </ol>
    </nav>
    <p
      className="mono"
      style={{
        gridColumn: "1 / -1",
        color: "var(--text-faint)",
        borderTop: "1px solid var(--border)",
        paddingTop: "1rem",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: ".5rem",
      }}
    >
      <span>&copy; Onqai</span>
      <span>Listen / Compare / Repeat</span>
    </p>
  </footer>
)
