import { FC } from "react"
import type { Metadata } from "next"
import { ChordProgressionPanel } from "components/game/ChordProgressionPanel"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/chord/`
const description =
  "循環コード・王道進行・小室進行・カノン進行など、代表的なコード進行を聴き比べて響きの違いを学べる無料の音楽理論ページです。"

export const metadata: Metadata = {
  title: "コード進行の差を聴き比べる",
  description,
  alternates: {
    canonical: "/chord/",
  },
  openGraph: {
    title: "コード進行の差を聴き比べる | 音当てゲーム",
    description,
    url: pageUrl,
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
    title: "コード進行の差を聴き比べる | 音当てゲーム",
    description,
  },
}

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "コード進行の差を聴き比べる",
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
    <ChordProgressionPanel />
  </>
)

export default Page
