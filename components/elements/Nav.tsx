"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"
import { CATALOG } from "lib/catalog"

const PRIMARY = [
  { href: "/#game", label: "PLAY" },
  { href: "/#index", label: "INDEX" },
  { href: "/about", label: "ABOUT" },
]

export const Nav: FC = () => {
  const pathname = usePathname()

  return (
    <nav aria-label="メイン">
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "clamp(.75rem, 3vw, 2rem)",
          padding: 0,
        }}
      >
        {PRIMARY.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="nav-link mono"
              aria-current={pathname === href ? "page" : undefined}
              style={{
                display: "block",
                padding: ".5rem 0",
                fontSize: ".8125rem",
                fontWeight: 500,
                letterSpacing: ".14em",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// 全コンテンツをアルバムの曲目のように並べる補助ナビ
export const Tracklist: FC = () => {
  const pathname = usePathname()

  return (
    <nav
      aria-label="コンテンツ"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <ol
        className="tracklist"
        style={{
          listStyle: "none",
          display: "flex",
          gap: "clamp(1rem, 2.5vw, 2.25rem)",
          padding: ".375rem var(--gutter)",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {CATALOG.map(({ no, href, title }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className="nav-link"
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: ".375rem",
                  padding: ".25rem 0",
                  fontSize: ".8125rem",
                  fontWeight: active ? 700 : 400,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: ".6875rem",
                  }}
                >
                  {no}
                </span>
                {title}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
