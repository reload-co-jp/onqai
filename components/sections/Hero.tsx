import { FC } from "react"

const BAR_HEIGHTS = [28, 48, 20, 40, 32, 52, 24, 44, 18, 36]

export const Hero: FC = () => (
  <section
    style={{
      textAlign: "center",
      padding: "3rem 1rem 2.5rem",
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,107,240,0.18) 0%, transparent 70%)",
      borderBottom: "1px solid #2a2a2a",
      marginBottom: "2rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "5px",
        height: "60px",
        marginBottom: "1.75rem",
      }}
      aria-hidden="true"
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: `${h}px`,
            borderRadius: "3px",
            backgroundColor: i % 3 === 1 ? "#a89af5" : "#7c6bf0",
            opacity: 0.7 + (h / 52) * 0.3,
          }}
        />
      ))}
    </div>

    <h1
      style={{
        fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
        fontWeight: "bold",
        color: "#f0f0f0",
        margin: "0 0 .5rem",
        letterSpacing: ".04em",
      }}
    >
      音当てゲーム
    </h1>

    <p
      style={{
        fontSize: ".875rem",
        color: "#7c6bf0",
        letterSpacing: ".12em",
        textTransform: "uppercase",
        margin: "0 0 1.25rem",
        fontWeight: "600",
      }}
    >
      Ear Training Game
    </p>

    <p
      style={{
        fontSize: "1rem",
        color: "#bbb",
        lineHeight: 1.7,
        margin: "0 auto",
        maxWidth: "400px",
      }}
    >
      再生された単音を聴いて、どの音階か当てよう。
      <br />
      音色を変えると、同じ音階でも聞こえ方が変わります。
    </p>

    <p
      style={{
        fontSize: ".8rem",
        color: "#555",
        marginTop: ".75rem",
      }}
    >
      音量にご注意ください
    </p>
  </section>
)
