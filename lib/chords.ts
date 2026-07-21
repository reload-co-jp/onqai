export type ChordQuality = "major" | "minor" | "diminished"

export type Chord = {
  id: string
  label: string
  root: number // C4からの半音数
  quality: ChordQuality
}

export type Progression = {
  id: string
  name: string
  description: string
  mood: string
  chords: Chord[]
}

const QUALITY_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
}

const C4_FREQUENCY = 261.63

export function chordFrequencies(chord: Chord): number[] {
  return QUALITY_INTERVALS[chord.quality].map((interval) =>
    C4_FREQUENCY * Math.pow(2, (chord.root + interval) / 12)
  )
}

const chord = (id: string, label: string, root: number, quality: ChordQuality): Chord => ({
  id,
  label,
  root,
  quality,
})

// キーはすべてCメジャーで統一し、進行どうしの響きの差を比べやすくする
const C = chord("C", "C", 0, "major")
const Dm = chord("Dm", "Dm", 2, "minor")
const Em = chord("Em", "Em", 4, "minor")
const F = chord("F", "F", 5, "major")
const G = chord("G", "G", 7, "major")
const Am = chord("Am", "Am", 9, "minor")

export const PROGRESSIONS: Progression[] = [
  {
    id: "junkan",
    name: "循環コード",
    description: "C→Am→F→G。ポップスで最もよく使われる、明るく安定した定番進行です。",
    mood: "明るい・安定",
    chords: [C, Am, F, G],
  },
  {
    id: "oudou",
    name: "王道進行",
    description: "F→G→Em→Am。サビ前後でよく使われ、明るさと切なさが同居する進行です。",
    mood: "切ない・ドラマチック",
    chords: [F, G, Em, Am],
  },
  {
    id: "komuro",
    name: "小室進行",
    description: "Am→F→G→C。短調始まりから長調に着地し、盛り上がりを作りやすい進行です。",
    mood: "盛り上がる・情熱的",
    chords: [Am, F, G, C],
  },
  {
    id: "canon",
    name: "カノン進行",
    description: "C→G→Am→Em→F→C→F→G。8つのコードで壮大に展開する、パッヘルベルのカノン由来の進行です。",
    mood: "壮大・感動的",
    chords: [C, G, Am, Em, F, C, F, G],
  },
  {
    id: "two-five-one",
    name: "ii-V-I進行",
    description: "Dm→G→C。ジャズで最も基本的な進行で、サブドミナントからドミナントを経てトニックへ滑らかに解決します。",
    mood: "滑らか・洗練",
    chords: [Dm, G, C],
  },
  {
    id: "dominant-motion",
    name: "ドミナントモーション",
    description: "G→C。G(ドミナント)からC(トニック)への終止は、強い解決感を持つ最も基本的な動きです。",
    mood: "強い解決感",
    chords: [G, C],
  },
  {
    id: "subdominant-motion",
    name: "サブドミナントモーション",
    description: "F→C。F(サブドミナント)からC(トニック)への終止は、ドミナントモーションより穏やかな解決感になります。",
    mood: "穏やかな解決感",
    chords: [F, C],
  },
]
