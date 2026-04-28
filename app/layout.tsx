import { Logo } from "components/elements/Logo"
import { Nav } from "components/elements/Nav"
import type { Metadata, Viewport } from "next"
import "./reset.css"

const siteUrl = "https://onqai.reload.co.jp"
const title = "音当てゲーム"
const description =
  "再生された単音を聴いて音階を当てる、無料の音感トレーニングゲームです。初級から上級まで、耳の練習や音痴改善の基礎練習に使えます。"
const ogImage = "/opengraph-image"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: title,
  title: {
    default: `${title} | 無料の音感トレーニング`,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    "音当てゲーム",
    "音感トレーニング",
    "耳トレ",
    "音痴 改善",
    "音階 練習",
    "絶対音感",
    "相対音感",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${title} | 無料の音感トレーニング`,
    description,
    url: siteUrl,
    siteName: title,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | 無料の音感トレーニング`,
    description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#222222",
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: title,
  url: siteUrl,
  inLanguage: "ja",
  description,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <header
          style={{
            backgroundColor: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Logo />
          <Nav />
        </header>
        <main
          style={{
            background: "#222",
            minHeight: "calc(100dvh - 5.625rem)",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#333",
            boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: ".75rem",
            padding: "1rem",
          }}
        >
          <p>&copy; Onqai</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
