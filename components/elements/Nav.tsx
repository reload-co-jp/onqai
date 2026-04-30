"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC } from "react"

const LINKS = [
  { href: "/", label: "ゲーム" },
  { href: "/sound", label: "音確認" },
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
                style={{
                  display: "block",
                  padding: ".375rem .75rem",
                  borderRadius: ".375rem",
                  fontSize: ".875rem",
                  color: active ? "#f0f0f0" : "#999",
                  backgroundColor: active ? "#2d2460" : "transparent",
                  textDecoration: "none",
                  fontWeight: active ? "600" : "400",
                  border: `1px solid ${active ? "#7c6bf0" : "transparent"}`,
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
