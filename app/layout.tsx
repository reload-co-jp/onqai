import { Logo } from "components/elements/Logo"
import { Nav } from "components/elements/Nav"
import { PwaInstallButton } from "components/elements/PwaInstallButton"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { M_PLUS_Rounded_1c } from "next/font/google"
import "./reset.css"

const font = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-body",
})

const siteUrl = "https://onqai.reload.co.jp"
const title = "音当てゲーム"
const description =
  "再生された単音を聴いて音階を当てる、無料の音感トレーニングゲームです。初級から上級まで、耳の練習や音痴改善の基礎練習に使えます。"
const ogImage = "/opengraph-image"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: title,
  manifest: "/manifest.json",
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
  themeColor: "#0d0b1a",
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: title,
  url: siteUrl,
  inLanguage: "ja",
  description,
}

const googleAnalyticsId = "G-C51YH3Y85F"
const isProduction = process.env.NODE_ENV === "production"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja" className={font.variable}>
      <body>
        {isProduction && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script id="register-sw" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`}
        </Script>
        <header
          className="site-header"
          style={{
            padding: "1rem var(--gutter)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Logo />
          <Nav />
        </header>
        <main
          style={{
            minHeight: "calc(100dvh - 5.625rem)",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: ".75rem",
            padding: "2.5rem var(--gutter)",
          }}
        >
          <p>&copy; Onqai</p>
          <PwaInstallButton />
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
