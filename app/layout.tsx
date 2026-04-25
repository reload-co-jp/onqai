import { Logo } from "components/elements/Logo"
import "./reset.css"

const siteUrl = "https://onqai.reload.co.jp"
const description = "再生された単音を聴いて、どの音階か当てるゲームです。音感トレーニングや耳の練習に使えます。"

export const metadata = {
  title: "音当てゲーム",
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "音当てゲーム",
    description,
    url: siteUrl,
    siteName: "音当てゲーム",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "音当てゲーム",
    description,
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem 1rem",
            position: "relative",
          }}
        >
          <Logo />
        </header>
        <main
          style={{
            background: "#222",
            minHeight: "calc(100dvh - 5.625rem)",
            padding: "1rem",
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
