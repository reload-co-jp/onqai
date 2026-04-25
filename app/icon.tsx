import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          paddingBottom: 5,
          backgroundColor: "#1a1a2e",
          borderRadius: 8,
        }}
      >
        {[10, 18, 7, 14, 10].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: h,
              backgroundColor: i === 1 ? "#a89af5" : "#7c6bf0",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    ),
    size
  )
}
