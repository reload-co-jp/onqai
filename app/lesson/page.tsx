import { FC } from "react"
import Link from "next/link"
import type { Metadata } from "next"

const siteUrl = "https://onqai.reload.co.jp"
const pageUrl = `${siteUrl}/lesson/`
const description =
  "音当てがうまくできるようになるための無料講座です。音の高さの聴き分け方、ドレミの覚え方、毎日の練習メニューを順番に解説します。"

export const metadata: Metadata = {
  title: "音当てがうまくなる講座",
  description,
  alternates: {
    canonical: "/lesson/",
  },
  openGraph: {
    title: "音当てがうまくなる講座 | 音当てゲーム",
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
    title: "音当てがうまくなる講座 | 音当てゲーム",
    description,
  },
}

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "音当てがうまくなる講座",
  description,
  url: pageUrl,
  inLanguage: "ja",
  isAccessibleForFree: true,
  provider: {
    "@type": "Organization",
    name: "Onqai",
    url: siteUrl,
  },
}

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

const Step: FC<{ number: string; title: string; text: string }> = ({ number, title, text }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "3rem 1fr",
      gap: "1rem",
      padding: "1rem",
      backgroundColor: "#1e1e2e",
      border: "1px solid #2d2460",
      borderRadius: ".5rem",
    }}
  >
    <span style={{ color: "#7c6bf0", fontWeight: "bold", fontSize: ".875rem" }}>{number}</span>
    <div>
      <h3 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: "bold", marginBottom: ".375rem" }}>
        {title}
      </h3>
      <p style={{ color: "#bbb", fontSize: ".9375rem", lineHeight: 1.7 }}>{text}</p>
    </div>
  </div>
)

const Page: FC = () => (
  <div
    style={{
      maxWidth: "760px",
      margin: "0 auto",
      padding: "2.5rem 1.25rem 4rem",
    }}
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
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
        Lesson
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
        音当てがうまくなる講座
      </h1>
      <p style={{ ...body, maxWidth: "560px", margin: "0 auto", color: "#aaa" }}>
        音当ては勘で当てるゲームではありません。
        <span style={strong}>音の高さを比べる順番</span>を覚えると、少しずつ正解の理由がわかるようになります。
      </p>
    </div>

    <Section title="まずは「高い・低い」だけを聴く">
      <p style={body}>
        最初から「これはF」「これはA」と名前を当てようとすると、耳よりも記憶に頼ってしまいます。
        まずは、直前に聴いた音より<span style={strong}>高いか低いか</span>だけを判断しましょう。
      </p>
      <p style={body}>
        高低の方向がわかるようになると、音名はあとからついてきます。
        迷ったときは鍵盤の左が低く、右が高いという位置関係に戻ってください。
      </p>
    </Section>

    <Section title="基準の音をひとつ決める">
      <p style={body}>
        音当てを安定させるコツは、全部の音を一気に覚えようとしないことです。
        最初は<span style={strong}>C（ド）を基準音</span>にして、ほかの音がCからどれくらい離れているかを感じます。
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginTop: "1.25rem" }}>
        <Step number="01" title="Cを聴く" text="低すぎず高すぎない、落ち着いた出発点としてCの響きを覚えます。" />
        <Step number="02" title="近い音から比べる" text="DやEはCの近く、Gは少し離れた明るい音として聴き分けます。" />
        <Step number="03" title="外れた理由を見る" text="正解が出たら、選んだ音が正解より上だったか下だったかを確認します。" />
      </div>
    </Section>

    <Section title="練習は初級から短く区切る">
      <p style={body}>
        上達の近道は、難しい問題を長時間続けることではありません。
        まずは初級で<span style={strong}>5問から10問だけ</span>解き、正答率よりも「聴き分けの感覚」を残します。
      </p>
      <p style={body}>
        70%以上が安定してきたら中級へ進みます。上級は半音が入るため、音の差がかなり細かくなります。
        焦らず、白鍵の音に慣れてから挑戦してください。
      </p>
    </Section>

    <Section title="よくあるつまずき">
      <div style={{ display: "grid", gap: ".75rem" }}>
        {[
          ["CとDが混ざる", "近い音は混ざって当然です。正解後にもう一度Cを思い出し、Dが少し上にある感覚を作ります。"],
          ["音色が変わるとわからない", "最初はサイン波だけで練習し、慣れてから三角波、矩形波へ広げます。"],
          ["高い音ほど全部同じに聞こえる", "音量を下げ、短い回数で休憩します。耳が疲れると高低差を追いにくくなります。"],
        ].map(([title, text]) => (
          <div
            key={title}
            style={{
              padding: "1rem",
              backgroundColor: "#1e1e2e",
              border: "1px solid #333",
              borderRadius: ".5rem",
            }}
          >
            <h3 style={{ color: "#f0f0f0", fontSize: "1rem", fontWeight: "bold", marginBottom: ".375rem" }}>
              {title}
            </h3>
            <p style={{ color: "#bbb", lineHeight: 1.7, fontSize: ".9375rem" }}>{text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="7日間の練習メニュー">
      <ol style={{ color: "#ccc", lineHeight: 1.9, paddingLeft: "1.25rem" }}>
        <li>1日目: 初級でC・D・Eの高さの違いに慣れる</li>
        <li>2日目: 初級を10問解き、外れた音が上か下か確認する</li>
        <li>3日目: 初級で正答率70%を目指す</li>
        <li>4日目: 中級で白鍵1オクターブの広さを体験する</li>
        <li>5日目: サイン波以外の音色で初級を解く</li>
        <li>6日目: 中級を短く2セット行う</li>
        <li>7日目: 結果をシェアして、次の目標を決める</li>
      </ol>
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
        講座を読みながら練習しよう
      </p>
      <p style={{ color: "#888", fontSize: ".875rem", marginBottom: "1.5rem" }}>
        まずは初級で5問だけ。耳に「比べ方」を覚えさせます。
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
