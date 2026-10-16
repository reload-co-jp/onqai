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
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0"
          y1="0"
          x2="28"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b7bff" />
          <stop offset="1" stopColor="#ff7ac6" />
        </linearGradient>
      </defs>
      <rect x="0" y="5" width="4" height="10" rx="2" fill="url(#logo-grad)" />
      <rect x="6" y="0" width="4" height="20" rx="2" fill="url(#logo-grad)" />
      <rect
        x="12"
        y="7"
        width="4"
        height="8"
        rx="2"
        fill="url(#logo-grad)"
        opacity=".6"
      />
      <rect x="18" y="2" width="4" height="16" rx="2" fill="url(#logo-grad)" />
      <rect x="24" y="5" width="4" height="11" rx="2" fill="url(#logo-grad)" />
    </svg>
    <span
      className="gradient-text"
      style={{
        fontSize: "1rem",
        fontWeight: "bold",
        letterSpacing: ".04em",
      }}
    >
      音当てゲーム
    </span>
  </div>
)
