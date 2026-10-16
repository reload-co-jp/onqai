// サイト内の各コンテンツ。ナビ・トップの一覧・フッターで共有
export type CatalogItem = {
  no: string
  href: string
  title: string
  en: string
  category: "PLAY" | "VOICE" | "LISTEN" | "STUDY"
  description: string
  color: string
}

export const CATALOG: CatalogItem[] = [
  {
    no: "01",
    href: "/",
    title: "ゲーム",
    en: "Pitch Quiz",
    category: "PLAY",
    description: "単音を聴いて音名を当てる。10問1セットの基本トレーニング。",
    color: "#e8380d",
  },
  {
    no: "02",
    href: "/melody",
    title: "メロディ",
    en: "Melody Dictation",
    category: "PLAY",
    description: "童謡・民謡の短い旋律を聴き、ドレミで答える。",
    color: "#2f5d8a",
  },
  {
    no: "03",
    href: "/vocal",
    title: "発声",
    en: "Vocal Pitch",
    category: "VOICE",
    description: "マイクに向かって歌い、指定の音を1.5秒キープする。",
    color: "#c99a1e",
  },
  {
    no: "04",
    href: "/kimigayo",
    title: "君が代",
    en: "Kimigayo",
    category: "VOICE",
    description: "君が代を1音ずつ歌い、音程をリアルタイムに判定する。",
    color: "#7a2e2e",
  },
  {
    no: "05",
    href: "/sound",
    title: "音確認",
    en: "Tone Check",
    category: "LISTEN",
    description: "CからBまでを鍵盤で鳴らし、音色の違いを聴き比べる。",
    color: "#3d7a5a",
  },
  {
    no: "06",
    href: "/pitch",
    title: "音程",
    en: "Pitch & Frequency",
    category: "STUDY",
    description: "ABC表記、ドレミ、周波数。A4=440Hzから始まる音の仕組み。",
    color: "#5b4a8a",
  },
  {
    no: "07",
    href: "/chord",
    title: "コード進行",
    en: "Chord Progressions",
    category: "LISTEN",
    description: "王道進行・小室進行・カノン進行を聴き比べる。",
    color: "#1f6f78",
  },
  {
    no: "08",
    href: "/lesson",
    title: "講座",
    en: "Lessons",
    category: "STUDY",
    description: "聴き分け方、ドレミの覚え方、毎日の練習メニュー。",
    color: "#8a5a2b",
  },
]
