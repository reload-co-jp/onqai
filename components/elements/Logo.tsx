import { FC } from "react"

export const Logo: FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
    <svg
      width="26"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0" y="5" width="4" height="10" rx="2" fill="#7c6bf0" />
      <rect x="6" y="0" width="4" height="20" rx="2" fill="#7c6bf0" />
      <rect x="12" y="7" width="4" height="8" rx="2" fill="#a89af5" />
      <rect x="18" y="2" width="4" height="16" rx="2" fill="#7c6bf0" />
      <rect x="24" y="5" width="4" height="11" rx="2" fill="#7c6bf0" />
    </svg>
    <span
      style={{
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#f0f0f0",
        letterSpacing: ".02em",
      }}
    >
      音当てゲーム
    </span>
  </div>
)
