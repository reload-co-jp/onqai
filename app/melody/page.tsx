import { FC } from "react"
import type { Metadata } from "next"
import { MelodyGamePanel } from "components/game/MelodyGamePanel"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/melody/`
const description =
  "童謡・民謡の短いメロディを聴いて、ドレミの音階を答える無料の音感トレーニングゲームです。"

export const metadata: Metadata = {
  title: "童謡・民謡メロディ音階ゲーム",
  description,
  alternates: {
    canonical: "/melody/",
  },
  openGraph: {
    title: "童謡・民謡メロディ音階ゲーム | 音当てゲーム",
    description,
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "童謡・民謡メロディ音階ゲーム | 音当てゲーム",
    description,
  },
}

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "童謡・民謡メロディ音階ゲーム",
  url: pageUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  isAccessibleForFree: true,
  description,
}

const Page: FC = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
    />
    <MelodyGamePanel />
  </>
)

export default Page

