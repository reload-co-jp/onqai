import { FC } from "react"
import type { Metadata } from "next"
import { NotePreviewPanel } from "components/game/NotePreviewPanel"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/sound/`
const description =
  "CからBまでの音を鍵盤で確認できる無料の音確認ページです。音当てゲームの練習前に、音の高さや音色の違いを聴き比べられます。"

export const metadata: Metadata = {
  title: "音を確認する",
  description,
  alternates: {
    canonical: "/sound/",
  },
  openGraph: {
    title: "音を確認する | 音当てゲーム",
    description,
    url: pageUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "音を確認する | 音当てゲーム",
    description,
  },
}

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "音を確認する",
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
    <NotePreviewPanel />
  </>
)

export default Page
