import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/pitch/`
const description =
  "音程、ABC表記、ドレミ、周波数の関係を解説します。C4からB4までの音名と周波数、A4=440Hz、半音とオクターブの仕組みを学べます。"

export const metadata: Metadata = {
  title: "音程・ABC・ドレミ・周波数の基礎",
  description,
  alternates: {
    canonical: "/pitch/",
  },
  openGraph: {
    title: "音程・ABC・ドレミ・周波数の基礎 | 音当てゲーム",
    description,
    url: pageUrl,
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
    title: "音程・ABC・ドレミ・周波数の基礎 | 音当てゲーム",
    description,
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "音程・ABC・ドレミ・周波数の基礎",
  description,
  url: pageUrl,
  mainEntityOfPage: pageUrl,
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

const noteRows = [
  ["C4", "ド", "261.63Hz", "基準にしやすい落ち着いた音"],
  ["C#4 / Db4", "ド# / レb", "277.18Hz", "CとDの間の半音"],
  ["D4", "レ", "293.66Hz", "Cより少し高い音"],
  ["D#4 / Eb4", "レ# / ミb", "311.13Hz", "DとEの間の半音"],
  ["E4", "ミ", "329.63Hz", "明るく聞こえやすい音"],
  ["F4", "ファ", "349.23Hz", "Eのすぐ上にある半音上の音"],
  ["F#4 / Gb4", "ファ# / ソb", "369.99Hz", "FとGの間の半音"],
  ["G4", "ソ", "392.00Hz", "Cから離れて聞こえる音"],
  ["G#4 / Ab4", "ソ# / ラb", "415.30Hz", "GとAの間の半音"],
  ["A4", "ラ", "440.00Hz", "チューニング基準に使われる音"],
  ["A#4 / Bb4", "ラ# / シb", "466.16Hz", "AとBの間の半音"],
  ["B4", "シ", "493.88Hz", "次のCに向かう高い音"],
]

const body: React.CSSProperties = {
  fontSize: "1rem",
  color: "#ccc",
  lineHeight: 1.9,
  margin: "0 0 1rem",
}

const strong: React.CSSProperties = {
  color: "#f0f0f0",
  fontWeight: "700",
}

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ padding: "2rem 0", borderBottom: "1px solid #2a2a2a" }}>
    <h2
      style={{
        fontSize: "1.35rem",
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

const Page: FC = () => (
  <div
    style={{
      maxWidth: "780px",
      margin: "0 auto",
      padding: "2.5rem 1.25rem 4rem",
    }}
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />

    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
        Pitch
      </p>
      <h1
        style={{
          fontSize: "clamp(1.75rem, 5vw, 2.6rem)",
          fontWeight: "bold",
          color: "#f0f0f0",
          lineHeight: 1.3,
          marginBottom: "1rem",
        }}
      >
        音程・ABC・ドレミ・周波数の基礎
      </h1>
      <p style={{ ...body, maxWidth: "600px", margin: "0 auto", color: "#aaa" }}>
        音の高さは、音名だけでなく<span style={strong}>周波数</span>でも表せます。
        ABCとドレミの対応を覚えると、音当ての答え方が整理しやすくなります。
      </p>
    </div>

    <Section title="音程は、音と音の高さの差">
      <p style={body}>
        音程は、2つの音の高さの距離です。CからDは近く、CからGは少し離れています。
        音当てでは、まず<span style={strong}>今聴いた音が基準音より高いか低いか</span>を感じることが大切です。
      </p>
      <p style={body}>
        音そのものの高さは「ピッチ」と呼ばれ、物理的には周波数で表せます。
        周波数が高いほど高い音、低いほど低い音になります。
      </p>
    </Section>

    <Section title="ABCとドレミの対応">
      <p style={body}>
        音楽では、ドレミとABCの2種類の呼び方がよく使われます。
        このゲームでは、画面上の回答に<span style={strong}>C D E F G A B</span>を使っています。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(5rem, 1fr))",
          gap: ".75rem",
          marginTop: "1.25rem",
        }}
      >
        {[
          ["C", "ド"],
          ["D", "レ"],
          ["E", "ミ"],
          ["F", "ファ"],
          ["G", "ソ"],
          ["A", "ラ"],
          ["B", "シ"],
        ].map(([abc, solfege]) => (
          <div
            key={abc}
            style={{
              padding: "1rem",
              backgroundColor: "#1e1e2e",
              border: "1px solid #2d2460",
              borderRadius: ".5rem",
              textAlign: "center",
            }}
          >
            <div style={{ color: "#f0f0f0", fontSize: "1.35rem", fontWeight: "bold" }}>{abc}</div>
            <div style={{ color: "#aaa", fontSize: ".9375rem", marginTop: ".25rem" }}>{solfege}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="周波数は、1秒あたりの振動数">
      <p style={body}>
        周波数の単位はHzです。440Hzは、1秒間に440回振動する音という意味です。
        一般的なチューニングでは<span style={strong}>A4（ラ）= 440Hz</span>が基準として使われます。
      </p>
      <p style={body}>
        1オクターブ上がると周波数は2倍、1オクターブ下がると半分になります。
        A4が440Hzなら、A5は880Hz、A3は220Hzです。
      </p>
    </Section>

    <Section title="C4からB4までの音名と周波数">
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#ccc",
            fontSize: ".9375rem",
          }}
        >
          <thead>
            <tr>
              {["ABC", "ドレミ", "周波数", "聴き方"].map((heading) => (
                <th
                  key={heading}
                  style={{
                    textAlign: "left",
                    padding: ".75rem",
                    color: "#f0f0f0",
                    borderBottom: "1px solid #444",
                    backgroundColor: "#1e1e2e",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {noteRows.map(([abc, solfege, frequency, hint]) => (
              <tr key={abc}>
                <td style={{ padding: ".75rem", borderBottom: "1px solid #2a2a2a", fontWeight: "700" }}>{abc}</td>
                <td style={{ padding: ".75rem", borderBottom: "1px solid #2a2a2a" }}>{solfege}</td>
                <td style={{ padding: ".75rem", borderBottom: "1px solid #2a2a2a" }}>{frequency}</td>
                <td style={{ padding: ".75rem", borderBottom: "1px solid #2a2a2a" }}>{hint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="半音と#・b">
      <p style={body}>
        CとDの間にはC#があります。#は半音上、bは半音下を表します。
        C#とDbは名前が違いますが、ピアノの同じ鍵盤を指すことが多い音です。
      </p>
      <p style={body}>
        上級モードでは、この半音も含めた12音を聴き分けます。
        白鍵だけより細かい差になるため、最初は音確認ページで音の距離を聴いてから練習すると安定します。
      </p>
    </Section>

    <div
      style={{
        marginTop: "2.5rem",
        textAlign: "center",
        padding: "2rem 1rem",
        backgroundColor: "#1e1e2e",
        borderRadius: ".5rem",
        border: "1px solid #2d2460",
      }}
    >
      <p style={{ color: "#f0f0f0", fontSize: "1.125rem", fontWeight: "bold", marginBottom: ".5rem" }}>
        音を聴いて対応を覚える
      </p>
      <p style={{ color: "#888", fontSize: ".875rem", marginBottom: "1.5rem" }}>
        表で見た音名を、実際の高さと結びつけます。
      </p>
      <Link
        href="/sound"
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
        音を確認する
      </Link>
    </div>
  </div>
)

export default Page
