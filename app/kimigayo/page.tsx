import { FC } from "react"
import type { Metadata } from "next"
import { KimigayoVocalPanel } from "components/game/KimigayoVocalPanel"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/kimigayo/`
const description =
  "君が代のメロディを1音ずつマイクで歌い、リアルタイムピッチ検出で音階を判定する練習ページです。"

export const metadata: Metadata = {
  title: "君が代メロディ発声判定 | マイクで音階練習",
  description,
  alternates: {
    canonical: "/kimigayo/",
  },
  openGraph: {
    title: "君が代メロディ発声判定 | 音当てゲーム",
    description,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "君が代メロディ発声判定",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "君が代メロディ発声判定 | 音当てゲーム",
    description,
  },
}

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "君が代メロディ発声判定",
  url: pageUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  isAccessibleForFree: true,
  description,
}

const Page: FC = () => (
  <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2rem 0 0" }}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
    />
    <div style={{ textAlign: "center", marginBottom: "2rem", padding: "0 1rem" }}>
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
        Kimigayo Vocal
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
        君が代メロディ発声判定
      </h1>
      <p style={{ color: "#aaa", fontSize: ".9375rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
        参考メロディを聴き、表示された音を順番に歌う。55セント以内で短くキープすると次へ進む。
      </p>
    </div>
    <KimigayoVocalPanel />
  </div>
)

export default Page
