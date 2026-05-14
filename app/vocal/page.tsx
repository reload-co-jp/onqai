import { FC } from "react"
import type { Metadata } from "next"
import { VocalGamePanel } from "components/game/VocalGamePanel"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/vocal/`
const description =
  "マイクに向かって歌い、指定の音階を出せるか測る練習ゲームです。リアルタイムでピッチを検出し、目標音に50セント以内で1.5秒キープすると成功です。"

export const metadata: Metadata = {
  title: "発声ピッチゲーム | マイクで音階を当てる",
  description,
  alternates: {
    canonical: "/vocal/",
  },
  openGraph: {
    title: "発声ピッチゲーム | 音当てゲーム",
    description,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "音当てゲーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "発声ピッチゲーム | 音当てゲーム",
    description,
  },
}

const Page: FC = () => (
  <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 1rem 0" }}>
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <p
        style={{
          fontSize: ".8rem",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#7c6bf0",
          fontWeight: "600",
          marginBottom: ".5rem",
        }}
      >
        Vocal Pitch
      </p>
      <h1
        style={{
          fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
          fontWeight: "bold",
          color: "#f0f0f0",
          lineHeight: 1.3,
          marginBottom: ".75rem",
        }}
      >
        発声ピッチゲーム
      </h1>
      <p style={{ color: "#aaa", fontSize: ".9375rem", maxWidth: "440px", margin: "0 auto" }}>
        表示された音階をマイクに向かって歌い、1.5秒キープすると成功。
        参考音を聴いて音程を確かめてから挑戦しよう。
      </p>
    </div>
    <VocalGamePanel />
  </div>
)

export default Page
