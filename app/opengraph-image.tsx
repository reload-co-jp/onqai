import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "音当てゲーム"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          {[40, 56, 48, 64, 52, 72, 44].map((h, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: h,
                borderRadius: 4,
                backgroundColor: i === 3 ? "#7c6bf0" : "#4a3fa0",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: "bold",
              color: "#f0f0f0",
            }}
          >
            音当てゲーム
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#aaa",
            }}
          >
            再生された単音を聴いて、どの音階か当てよう
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
            <div
              key={note}
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                backgroundColor: "#2d2460",
                border: "2px solid #7c6bf0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#f0f0f0",
              }}
            >
              {note}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
