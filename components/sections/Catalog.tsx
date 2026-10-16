import Link from "next/link"
import { FC } from "react"
import { CATALOG, type CatalogItem } from "lib/catalog"

// 作品ごとに異なる幾何学ジャケット。番号で図形を切り替える
const Cover: FC<{ item: CatalogItem; index: number }> = ({ item, index }) => {
  const c = item.color
  const shapes = [
    // レコード盤
    <>
      <circle cx="50" cy="50" r="38" style={{ fill: c }} />
      {[30, 22, 14].map((r) => (
        <circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth=".6"
          style={{ stroke: "var(--paper)" }}
        />
      ))}
      <circle cx="50" cy="50" r="4" style={{ fill: "var(--paper)" }} />
    </>,
    // スペクトル
    <>
      {[34, 58, 42, 72, 50, 28, 64, 38, 20].map((h, i) => (
        <rect
          key={i}
          x={10 + i * 9}
          y={90 - h}
          width="6"
          height={h}
          style={{ fill: i === 3 ? c : "var(--text)" }}
        />
      ))}
    </>,
    // 声の波紋
    <>
      {[40, 30, 20, 10].map((r, i) => (
        <circle
          key={r}
          cx="30"
          cy="70"
          r={r}
          fill="none"
          strokeWidth={i === 0 ? 3 : 1}
          style={{ stroke: i === 0 ? c : "var(--text)" }}
        />
      ))}
      <rect x="62" y="12" width="26" height="26" style={{ fill: c }} />
    </>,
    // 日の丸を思わせる構図
    <>
      <rect
        x="10"
        y="22"
        width="80"
        height="56"
        fill="none"
        strokeWidth="1"
        style={{ stroke: "var(--text)" }}
      />
      <circle cx="50" cy="50" r="16" style={{ fill: c }} />
    </>,
    // 鍵盤
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={12 + i * 11}
          y="20"
          width="10"
          height="60"
          fill="none"
          strokeWidth=".8"
          style={{ stroke: "var(--text)" }}
        />
      ))}
      {[0, 1, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={19 + i * 11}
          y="20"
          width="6"
          height="36"
          style={{ fill: i === 4 ? c : "var(--text)" }}
        />
      ))}
    </>,
    // 周波数の波
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M10 ${30 + i * 10} Q 30 ${18 + i * 10} 50 ${30 + i * 10} T 90 ${30 + i * 10}`}
          fill="none"
          strokeWidth={i === 2 ? 2.5 : 0.8}
          style={{ stroke: i === 2 ? c : "var(--text)" }}
        />
      ))}
    </>,
    // 和音の積み重ね
    <>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={32 + i * 18}
          cy={68 - i * 18}
          r="14"
          style={{ fill: i === 1 ? c : "var(--text)" }}
        />
      ))}
    </>,
    // 五線譜
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="8"
          x2="92"
          y1={30 + i * 10}
          y2={30 + i * 10}
          strokeWidth=".8"
          style={{ stroke: "var(--text)" }}
        />
      ))}
      <ellipse cx="38" cy="60" rx="7" ry="5" style={{ fill: c }} />
      <ellipse cx="62" cy="45" rx="7" ry="5" style={{ fill: "var(--text)" }} />
    </>,
  ]

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        background: "var(--surface)",
      }}
    >
      {shapes[index % shapes.length]}
    </svg>
  )
}

const Featured: FC<{ item: CatalogItem; index: number; large?: boolean }> = ({
  item,
  index,
  large,
}) => (
  <Link
    href={item.href}
    className="jacket"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: ".75rem",
      textDecoration: "none",
    }}
  >
    <Cover item={item} index={index} />
    <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
      <span className="mono" style={{ color: item.color }}>
        {item.no}
      </span>
      <div>
        <h3
          style={{
            fontSize: large ? "clamp(1.75rem, 4vw, 3rem)" : "1.5rem",
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          {item.title}
        </h3>
        <p
          className="mono"
          style={{ color: "var(--text-muted)", marginTop: ".25rem" }}
        >
          {item.en} — {item.category}
        </p>
        <p
          style={{
            fontSize: ".9375rem",
            marginTop: ".5rem",
            color: "var(--text-muted)",
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  </Link>
)

export const Catalog: FC = () => {
  const [first, second, ...rest] = CATALOG

  return (
    <section
      id="index"
      aria-labelledby="index-title"
      style={{
        padding: "var(--section) var(--gutter)",
        borderTop: "1px solid var(--rule)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        <h2
          id="index-title"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 7rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
          }}
        >
          Index
        </h2>
        <p
          className="mono"
          style={{ color: "var(--text-muted)", textAlign: "right" }}
        >
          Catalog of {CATALOG.length} Works
          <br />
          作品一覧 / 聴く・歌う・学ぶ
        </p>
      </header>

      <div className="catalog-featured">
        <Featured item={first} index={0} large />
        <Featured item={second} index={1} />
      </div>

      <ol
        style={{
          listStyle: "none",
          padding: 0,
          borderTop: "1px solid var(--rule)",
          marginTop: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        {rest.map((item, i) => (
          <li key={item.href} style={{ borderBottom: "1px solid var(--rule)" }}>
            <Link href={item.href} className="catalog-row">
              <span className="mono catalog-meta" style={{ color: item.color }}>
                {item.no}
              </span>
              <span style={{ width: "3.5rem" }}>
                <Cover item={item} index={i + 2} />
              </span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </span>
                <span
                  className="mono catalog-meta"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.en}
                </span>
              </span>
              <span
                className="catalog-desc catalog-meta"
                style={{ fontSize: ".875rem", color: "var(--text-muted)" }}
              >
                {item.description}
              </span>
              <span
                className="mono catalog-meta catalog-cat"
                style={{ color: "var(--text-muted)" }}
              >
                {item.category}
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
