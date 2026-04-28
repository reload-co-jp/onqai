import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "音痴は治せる",
  description:
    "音階を識別する耳を育てることで、音痴は改善できます。音感トレーニングの仕組みと、このアプリでの練習方法を解説します。",
  alternates: {
    canonical: "/about/",
  },
  openGraph: {
    title: "音痴は治せる | 音当てゲーム",
    description:
      "音階を識別する耳を育てることで、音痴は改善できます。音感トレーニングの仕組みと、このアプリでの練習方法を解説します。",
    url: "https://onqai.reload.co.jp/about/",
    type: "article",
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
    title: "音痴は治せる | 音当てゲーム",
    description:
      "音階を識別する耳を育てることで、音痴は改善できます。音感トレーニングの仕組みと、このアプリでの練習方法を解説します。",
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "音痴は、治せる。",
  description:
    "音階を識別する耳を育てることで、音痴は改善できます。音感トレーニングの仕組みと、このアプリでの練習方法を解説します。",
  url: "https://onqai.reload.co.jp/about/",
  mainEntityOfPage: "https://onqai.reload.co.jp/about/",
  inLanguage: "ja",
  author: {
    "@type": "Organization",
    name: "Onqai",
  },
  publisher: {
    "@type": "Organization",
    name: "Onqai",
  },
}

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section
    style={{
      padding: "2rem 0",
      borderBottom: "1px solid #2a2a2a",
    }}
  >
    <h2
      style={{
        fontSize: "1.25rem",
        fontWeight: "bold",
        color: "#a89af5",
        marginBottom: "1rem",
      }}
    >
      {title}
    </h2>
    {children}
  </section>
)

const body: React.CSSProperties = {
  fontSize: "1rem",
  color: "#ccc",
  lineHeight: 1.9,
  margin: "0 0 1rem",
}

const emphasis: React.CSSProperties = {
  color: "#f0f0f0",
  fontWeight: "600",
}

const Page: FC = () => (
  <div
    style={{
      maxWidth: "680px",
      margin: "0 auto",
      padding: "2.5rem 1.25rem 4rem",
    }}
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
    {/* ページヒーロー */}
    <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
      <p
        style={{
          fontSize: ".8rem",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#7c6bf0",
          fontWeight: "600",
          marginBottom: ".75rem",
        }}
      >
        About
      </p>
      <h1
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
          fontWeight: "bold",
          color: "#f0f0f0",
          lineHeight: 1.3,
          marginBottom: "1rem",
        }}
      >
        音痴は、治せる。
      </h1>
      <p style={{ fontSize: "1rem", color: "#aaa", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto" }}>
        音痴の多くは生まれつきではなく、<span style={emphasis}>「音を正確に聴く習慣」が育っていないだけ</span>です。
        耳を鍛えることで、誰でも音程感覚を身につけられます。
      </p>
    </div>

    {/* セクション群 */}
    <Section title="音痴の正体">
      <p style={body}>
        音痴とは一般に、「歌うときに音程が外れてしまう状態」を指します。
        しかし医学的な意味での「音が聞こえない」人はごく少数で、
        大多数の音痴は<span style={emphasis}>「音の高さの違いを認識する経験が少ない」</span>ことが原因です。
      </p>
      <p style={body}>
        音を認識する力は、使えば使うほど精度が上がります。
        幼いころから音楽に触れて育った人が音感に優れているのは才能ではなく、
        単純に<span style={emphasis}>訓練の量の差</span>です。
      </p>
    </Section>

    <Section title="音階識別が「聴く耳」を育てる">
      <p style={body}>
        音感トレーニングの第一歩は、<span style={emphasis}>「この音は C だ」「この音は A だ」と識別できるようになること</span>です。
        音階を識別する練習を繰り返すと、脳が音の高低をより細かく処理するようになります。
      </p>
      <p style={body}>
        自分の声と正解の音との差（ズレ）に気づけるようになれば、
        無意識に声の高さを調整する能力が育ちます。
        これが「音痴が治る」メカニズムです。
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          margin: "1.5rem 0",
        }}
      >
        {[
          { step: "01", text: "音階を繰り返し聴いて、音の高低を体に覚えさせる" },
          { step: "02", text: "「何の音か」を当てる練習で識別精度を上げる" },
          { step: "03", text: "正解音と自分の声を比べ、ズレを意識する" },
          { step: "04", text: "ズレに気づく → 修正する、のループで音程感覚が定着" },
        ].map(({ step, text }) => (
          <div
            key={step}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              padding: ".875rem 1rem",
              backgroundColor: "#1e1e2e",
              borderRadius: ".5rem",
              border: "1px solid #2d2460",
            }}
          >
            <span
              style={{
                fontSize: ".75rem",
                fontWeight: "bold",
                color: "#7c6bf0",
                letterSpacing: ".06em",
                flexShrink: 0,
                paddingTop: ".1rem",
              }}
            >
              {step}
            </span>
            <span style={{ fontSize: ".9375rem", color: "#ccc", lineHeight: 1.6 }}>{text}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="音色の違いを知ることも訓練になる">
      <p style={body}>
        同じ「C（ド）」の音でも、ピアノとバイオリンでは聞こえ方が異なります。
        これは<span style={emphasis}>音色（timbre）</span>の違いによるもので、
        音の高さ自体は同じです。
      </p>
      <p style={body}>
        このアプリでは、サイン波・矩形波・のこぎり波・三角波の4種類の音色で練習できます。
        音色が変わっても同じ音階を正確に識別する経験を積むことで、
        実際の楽器や歌声に対しても応用できる<span style={emphasis}>汎用的な音感</span>が育ちます。
      </p>
    </Section>

    <Section title="このアプリでの練習方法">
      <p style={body}>
        まずは<span style={emphasis}>初級（C D E F G の5音）</span>からはじめましょう。
        音の数が少ない分、それぞれの音の特徴を覚えやすくなっています。
      </p>
      <p style={body}>
        慣れてきたら中級（白鍵1オクターブ）、上級（半音を含む12音）へと進んでください。
        毎日5〜10分の練習を続けるだけで、数週間で音程感覚の変化を実感できます。
      </p>
      <p style={{ ...body, marginBottom: 0 }}>
        難しく考える必要はありません。ゲームとして楽しみながら繰り返すことが、
        最も効果的なトレーニングです。
      </p>
    </Section>

    {/* CTA */}
    <div
      style={{
        marginTop: "2.5rem",
        textAlign: "center",
        padding: "2rem 1rem",
        backgroundColor: "#1e1e2e",
        borderRadius: "1rem",
        border: "1px solid #2d2460",
      }}
    >
      <p
        style={{
          fontSize: "1.125rem",
          fontWeight: "bold",
          color: "#f0f0f0",
          marginBottom: ".5rem",
        }}
      >
        さっそく練習をはじめよう
      </p>
      <p style={{ fontSize: ".875rem", color: "#888", marginBottom: "1.5rem" }}>
        音量に注意して、再生ボタンを押してください
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: ".75rem 2.5rem",
          borderRadius: ".5rem",
          backgroundColor: "#7c6bf0",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        ゲームで練習する
      </Link>
    </div>
  </div>
)

export default Page
