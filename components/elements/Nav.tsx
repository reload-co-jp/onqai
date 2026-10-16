"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"

const LINKS = [
  { href: "/", label: "ゲーム" },
  { href: "/melody", label: "メロディ" },
  { href: "/vocal", label: "発声" },
  { href: "/kimigayo", label: "君が代" },
  { href: "/sound", label: "音確認" },
  { href: "/pitch", label: "音程" },
  { href: "/chord", label: "コード進行" },
  { href: "/lesson", label: "講座" },
  { href: "/about", label: "このアプリについて" },
]

export const Nav: FC = () => {
  const pathname = usePathname()

  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: ".25rem",
          padding: 0,
          margin: 0,
        }}
      >
        {LINKS.map(({ href, label }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={active ? undefined : "nav-link"}
                style={{
                  display: "block",
                  padding: ".375rem .875rem",
                  borderRadius: "999px",
                  fontSize: ".875rem",
                  color: active ? "#fff" : "var(--text-muted)",
                  background: active
                    ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
                    : "transparent",
                  textDecoration: "none",
                  fontWeight: active ? "600" : "400",
                  border: "1px solid transparent",
                  boxShadow: active
                    ? "0 4px 16px rgba(139, 123, 255, 0.35)"
                    : "none",
                }}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
