# Onqai

音当てゲーム Webアプリ

https://onqai.reload.co.jp

## 1. 概要

音色を選択し、再生された単音がどの音階かを当てるWebゲームを作成する。
ブラウザ上で完結する音感トレーニング用アプリとして実装する。

ユーザーは「音色」「難易度」「出題範囲」を選び、再生された音を聴いて、該当する音名をボタンで回答する。
正解・不正解を即時フィードバックし、スコアや正答率を表示する。

---

## 2. 目的

- 音感トレーニングをブラウザだけで手軽にできるようにする
- 音色ごとの聞こえ方の違いを体験できるようにする
- 単音の音階判別をゲーム形式で楽しく練習できるようにする
- 将来的に絶対音感・相対音感トレーニング機能へ拡張できる土台を作る

---

## 3. 想定ユーザー

- 音楽初心者
- 楽器練習者
- 作曲・DTMに興味がある人
- 音感トレーニングをしたい人
- ブラウザで遊べるシンプルな音楽ゲームを探している人

---

## 4. 技術構成

### 4.1 フレームワーク

- Next.js
- TypeScript
- React

### 4.2 音生成

- Web Audio APIを使用する
- 外部音源ファイルは使用しない
- `OscillatorNode` により単音を生成する

### 4.3 データ保存

初期版ではDBは使用しない。

- 現在のスコア: React state
- 過去の成績: localStorage
- 苦手音階の集計: localStorage

---

## 5. 画面構成

## 5.1 トップ画面 / ゲーム画面

初期版では1画面構成とする。

### 表示要素

- アプリタイトル
- 説明文
- 音色選択
- 難易度選択
- 出題範囲選択
- 再生ボタン
- もう一度聴くボタン
- 回答ボタン一覧
- 正誤フィードバック
- 現在スコア
- 正答率
- 連続正解数
- リセットボタン

---

## 6. 基本ゲームフロー

1. ユーザーが音色を選ぶ
2. ユーザーが難易度を選ぶ
3. 「出題開始」または「再生」ボタンを押す
4. アプリがランダムに音階を選ぶ
5. Web Audio APIで単音を再生する
6. ユーザーが音名ボタンを押して回答する
7. 正解・不正解を表示する
8. スコアを更新する
9. 次の問題に進む

---

## 7. 音色仕様

Web Audio APIの `OscillatorType` を利用する。

### 対応音色

| 表示名     | oscillator.type | 説明                         |
| ---------- | --------------- | ---------------------------- |
| サイン波   | `sine`          | 純音に近く、初心者向け       |
| 矩形波     | `square`        | ファミコン風のはっきりした音 |
| のこぎり波 | `sawtooth`      | シンセサイザー風の明るい音   |
| 三角波     | `triangle`      | 柔らかく丸い音               |

初期選択は `sine` とする。

---

## 8. 音階仕様

### 8.1 初期対応音階

1オクターブ固定で開始する。

| 音名 | 周波数 |
| ---- | -----: |
| C4   | 261.63 |
| D4   | 293.66 |
| E4   | 329.63 |
| F4   | 349.23 |
| G4   | 392.00 |
| A4   | 440.00 |
| B4   | 493.88 |

### 8.2 拡張候補

将来的には以下を追加できるようにする。

- C# / Db
- D# / Eb
- F# / Gb
- G# / Ab
- A# / Bb
- 複数オクターブ
- ランダムオクターブ
- 基準音を聴いてから答える相対音感モード

---

## 9. 難易度仕様

| 難易度 | 出題範囲                                | 説明               |
| ------ | --------------------------------------- | ------------------ |
| 初級   | C, D, E, F, G                           | 選択肢を少なくする |
| 中級   | C, D, E, F, G, A, B                     | 白鍵1オクターブ    |
| 上級   | C, C#, D, D#, E, F, F#, G, G#, A, A#, B | 半音を含む         |

初期実装では初級・中級のみでもよい。
上級はデータ構造だけ用意し、UI上では非表示でもよい。

---

## 10. 音再生仕様

### 10.1 再生時間

- 初期値: 1秒
- 将来的に設定可能にする

### 10.2 音量

- 初期値: 0.3程度
- `GainNode` を使い、音量が大きくなりすぎないようにする

### 10.3 クリックノイズ対策

音の開始・終了時に急激に音量を変えるとノイズが出るため、短いフェードイン・フェードアウトを入れる。

推奨:

- attack: 0.01秒
- release: 0.05秒

---

## 11. UI仕様

### 11.1 音色選択

ラジオボタンまたはセレクトボックスで選択する。

選択肢:

- サイン波
- 矩形波
- のこぎり波
- 三角波

### 11.2 回答ボタン

難易度に応じた音名ボタンを表示する。

例:

```text
C  D  E  F  G  A  B
```

### 11.3 フィードバック表示

回答後に以下を表示する。

正解時:

```text
正解！ C4 でした
```

不正解時:

```text
不正解。正解は C4 でした
```

### 11.4 スコア表示

表示項目:

- 正解数
- 出題数
- 正答率
- 連続正解数

例:

```text
スコア: 8 / 10
正答率: 80%
連続正解: 3
```

---

## 12. 状態管理

React stateで管理する。

### 主な状態

```ts
type OscillatorWaveType = "sine" | "square" | "sawtooth" | "triangle"

type Note = {
  id: string
  label: string
  frequency: number
}

type Difficulty = "easy" | "normal" | "hard"

type GameState = {
  currentNote: Note | null
  selectedWaveType: OscillatorWaveType
  difficulty: Difficulty
  correctCount: number
  totalCount: number
  streak: number
  lastAnswer: string | null
  lastResult: "correct" | "wrong" | null
}
```

---

## 13. ディレクトリ構成案

```text
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    GamePanel.tsx
    WaveTypeSelector.tsx
    DifficultySelector.tsx
    AnswerButtons.tsx
    ScoreBoard.tsx
    FeedbackMessage.tsx
  lib/
    audio.ts
    notes.ts
    game.ts
  types/
    game.ts
```

---

## 14. 主要モジュール仕様

## 14.1 `lib/notes.ts`

音階データを定義する。

```ts
export const NOTES = [
  { id: "C4", label: "C", frequency: 261.63 },
  { id: "D4", label: "D", frequency: 293.66 },
  { id: "E4", label: "E", frequency: 329.63 },
  { id: "F4", label: "F", frequency: 349.23 },
  { id: "G4", label: "G", frequency: 392.0 },
  { id: "A4", label: "A", frequency: 440.0 },
  { id: "B4", label: "B", frequency: 493.88 },
]
```

## 14.2 `lib/audio.ts`

Web Audio APIで音を鳴らす。

```ts
export function playTone(params: {
  frequency: number
  type: OscillatorType
  duration?: number
  volume?: number
}): void
```

仕様:

- AudioContextを生成する
- OscillatorNodeを生成する
- GainNodeで音量制御する
- 短いフェードイン・フェードアウトを入れる
- 指定秒数後に停止する

注意:

- iOS / Safari対策として、ユーザー操作イベント内でAudioContextを開始する
- 初回クリック前に自動再生しない

## 14.3 `lib/game.ts`

ゲームロジックを定義する。

```ts
export function getRandomNote(notes: Note[]): Note
export function judgeAnswer(answer: string, currentNote: Note): boolean
export function getNotesByDifficulty(difficulty: Difficulty): Note[]
```

---

## 15. localStorage仕様

初期版では必須ではないが、以下を保存できるようにする。

### 保存キー

```text
pitch-game-stats
```

### 保存データ例

```ts
type StoredStats = {
  totalCount: number
  correctCount: number
  bestStreak: number
  mistakesByNote: Record<string, number>
  updatedAt: string
}
```

---

## 16. レスポンシブ対応

スマホでも遊べるようにする。

### 方針

- 回答ボタンは大きめにする
- 1行に入りきらない場合は折り返す
- 再生ボタンは目立たせる
- タップしやすい余白を確保する

---

## 17. デザイン方針

- 音楽学習アプリらしくシンプルにする
- ゲーム感は出すが、派手にしすぎない
- 正解・不正解が瞬時にわかるようにする
- 初心者が迷わないUIにする

### カラー例

- 背景: 明るいグレーまたは白
- メイン: 青系または紫系
- 正解: 緑系
- 不正解: 赤系

---

## 18. アクセシビリティ

- ボタンには明確なラベルをつける
- キーボード操作でも回答できるようにする
- 音が出るアプリであることを明記する
- 音量に注意する説明を入れる

---

## 19. エラーハンドリング

### 想定される問題

- ブラウザがWeb Audio APIに対応していない
- AudioContextがユーザー操作前に開始できない
- 音が鳴らない

### 対応

Web Audio API非対応時:

```text
お使いのブラウザでは音声再生機能に対応していません。
Chrome / Safari / Edge などの最新版でお試しください。
```

初回再生前:

```text
再生ボタンを押すと音が鳴ります。音量にご注意ください。
```

---

## 20. MVP範囲

最初に作る範囲は以下とする。

### 必須

- Next.jsで1画面アプリを作る
- Web Audio APIで単音を鳴らす
- 音色を選択できる
- 音階をランダム出題する
- 回答ボタンで答えられる
- 正解・不正解を表示する
- スコアを表示する

### 後回し

- ユーザー登録
- ランキング
- MIDI対応
- 音源ファイル再生
- 複数モード
- DB保存
- SNS共有

---

## 21. 将来拡張

### 21.1 トレーニングモード

- 苦手な音を重点的に出題
- 正答率が低い音階を優先する

### 21.2 相対音感モード

- 最初に基準音を鳴らす
- 次に別の音を鳴らす
- 何度離れているかを当てる

例:

- 完全5度
- 長3度
- 短3度
- オクターブ

### 21.3 コード当てモード

単音ではなく和音を鳴らして、コード名を当てる。

例:

- C
- Cm
- C7
- CM7
- Csus4

### 21.4 ランキング

- 連続正解数ランキング
- 正答率ランキング
- タイムアタックランキング

### 21.5 デイリーチャレンジ

- 1日10問
- 結果をlocalStorageに保存
- カレンダー表示

---

## 22. 実装時の注意点

### 22.1 Next.jsのクライアントコンポーネント

Web Audio APIはブラウザAPIのため、音を扱うコンポーネントはクライアントコンポーネントにする。

```ts
"use client"
```

### 22.2 SSRでwindowを直接参照しない

`window`, `AudioContext`, `localStorage` はサーバー側では存在しない。
必ずクライアント側のイベントまたは `useEffect` 内で扱う。

### 22.3 AudioContextの再利用

毎回AudioContextを大量生成しない。
可能であればモジュール内で1つのAudioContextを再利用する。

---

## 23. 受け入れ条件

以下を満たせばMVP完了とする。

- ページを開くとゲーム画面が表示される
- 音色を選択できる
- 再生ボタンを押すと単音が鳴る
- 出題音がランダムに変わる
- 音名ボタンで回答できる
- 正解時に正解メッセージが出る
- 不正解時に正解音名が表示される
- 正解数・出題数・正答率が更新される
- スマホ幅でも操作できる
- 初回表示時に勝手に音が鳴らない

---

## 24. 実装優先順位

1. Next.jsプロジェクト作成
2. 1画面UI作成
3. Web Audio APIで固定音を再生
4. 音階データ作成
5. ランダム出題
6. 回答ボタン作成
7. 正誤判定
8. スコア表示
9. 音色選択
10. 難易度選択
11. localStorage保存
12. デザイン調整

---

## 25. 初期ページ文言案

```text
音当てゲーム

再生された単音を聴いて、どの音階か当ててみましょう。
音色を変えると、同じ音階でも聞こえ方が変わります。
音感トレーニングや耳の練習に使えます。

音量に注意して、再生ボタンを押してください。
```

---

## 26. ページタイトル案

- 音当てゲーム
- Pitch Guess
- 単音音階クイズ
- Ear Training Game
- 音感トレーニング

初期タイトルは「音当てゲーム」とする。

---

## 27. URL構成

初期版ではトップページのみ。

```text
/
```

将来的な拡張:

```text
/training
/daily
/stats
/settings
```
