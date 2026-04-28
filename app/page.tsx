import { FC } from "react"
import type { Metadata } from "next"
import { Hero } from "components/sections/Hero"
import { GamePanel } from "components/game/GamePanel"

const siteUrl = "https://onqai.reload.co.jp"
const description =
  "再生された単音を聴いて音階を当てる、無料の音感トレーニングゲームです。初級・中級・上級の難易度と4種類の音色で耳を鍛えられます。"

export const metadata: Metadata = {
  title: "音当てゲーム | 無料の音感トレーニング",
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "音当てゲーム | 無料の音感トレーニング",
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "音当てゲーム | 無料の音感トレーニング",
    description,
  },
}

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "音当てゲーム",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  isAccessibleForFree: true,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  featureList: [
    "再生された単音の音階を当てる練習",
    "初級・中級・上級の難易度切り替え",
    "サイン波・矩形波・のこぎり波・三角波の音色切り替え",
  ],
}

const Page: FC = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
    />
    <Hero />
    <GamePanel />
  </>
)

export default Page
