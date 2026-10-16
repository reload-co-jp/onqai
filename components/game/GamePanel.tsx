"use client"
import { FC, useState, useCallback, useEffect } from "react"
import type { GameState, OscillatorWaveType, Difficulty } from "types/game"
import { playTone } from "lib/audio"
import { getRandomNote, judgeAnswer, getNotesByDifficulty } from "lib/game"
import { WaveTypeSelector } from "components/game/WaveTypeSelector"
import { DifficultySelector } from "components/game/DifficultySelector"
import { PianoKeyboard } from "components/game/PianoKeyboard"
import { ScoreBoard } from "components/game/ScoreBoard"
import { FeedbackMessage } from "components/game/FeedbackMessage"
import { WaveVisualizer } from "components/game/WaveVisualizer"

const initialState: GameState = {
  currentNote: null,
  selectedWaveType: "sine",
  difficulty: "normal",
  correctCount: 0,
  totalCount: 0,
  streak: 0,
  lastAnswer: null,
  lastResult: null,
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "初級",
  normal: "中級",
  hard: "上級",
}

const WAVE_TYPE_LABELS: Record<OscillatorWaveType, string> = {
  piano: "ピアノ",
  organ: "オルガン",
  guitar: "ギター",
  trumpet: "トランペット",
  oboe: "オーボエ",
  voice: "声色",
  sine: "サイン波",
  square: "矩形波",
  sawtooth: "のこぎり波",
  triangle: "三角波",
}

const GAME_LIMIT = 10

const createShareText = (state: GameState) => {
  const accuracy = Math.round((state.correctCount / state.totalCount) * 100)

  return [
    "音当てゲームの結果",
    `${state.correctCount}/${state.totalCount}問正解（正答率${accuracy}%）`,
    `連続正解: ${state.streak}`,
    `難易度: ${DIFFICULTY_LABELS[state.difficulty]} / 音色: ${WAVE_TYPE_LABELS[state.selectedWaveType]}`,
  ].join("\n")
}

export const GamePanel: FC = () => {
  const [state, setState] = useState<GameState>(initialState)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  const currentNotes = getNotesByDifficulty(state.difficulty)
  const isGameComplete = state.totalCount >= GAME_LIMIT
  const accuracy =
    state.totalCount > 0
      ? Math.round((state.correctCount / state.totalCount) * 100)
      : 0

  const playNote = useCallback(
    (frequency: number, waveType: OscillatorWaveType) => {
      setIsPlaying(true)
      playTone({ frequency, type: waveType })
      setTimeout(() => setIsPlaying(false), 1100)
    },
    []
  )

  const handlePlay = useCallback(() => {
    if (state.totalCount >= GAME_LIMIT) return
    const note = getRandomNote(currentNotes)
    setState((prev) => ({
      ...prev,
      currentNote: note,
      lastAnswer: null,
      lastResult: null,
    }))
    playNote(note.frequency, state.selectedWaveType)
  }, [currentNotes, state.selectedWaveType, state.totalCount, playNote])

  const handleReplay = useCallback(() => {
    if (!state.currentNote || isPlaying) return
    playNote(state.currentNote.frequency, state.selectedWaveType)
  }, [state.currentNote, state.selectedWaveType, isPlaying, playNote])

  const handleAnswer = useCallback(
    (noteId: string) => {
      if (
        !state.currentNote ||
        state.lastResult !== null ||
        state.totalCount >= GAME_LIMIT
      )
        return
      const correct = judgeAnswer(noteId, state.currentNote)
      setState((prev) => ({
        ...prev,
        lastAnswer: noteId,
        lastResult: correct ? "correct" : "wrong",
        correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
        totalCount: prev.totalCount + 1,
        streak: correct ? prev.streak + 1 : 0,
      }))
    },
    [state.currentNote, state.lastResult, state.totalCount]
  )

  const handleReset = useCallback(() => {
    setState(initialState)
    setShareMessage(null)
  }, [])

  const handleWaveChange = useCallback((type: OscillatorWaveType) => {
    setState((prev) => ({ ...prev, selectedWaveType: type }))
    setShareMessage(null)
  }, [])

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({
      ...prev,
      difficulty,
      currentNote: null,
      lastAnswer: null,
      lastResult: null,
    }))
    setShareMessage(null)
  }, [])

  const handleShare = useCallback(async () => {
    if (state.totalCount === 0) return

    const url = window.location.origin || "https://onqai.reload.co.jp"
    const text = createShareText(state)
    const shareUrl = new URL("https://twitter.com/intent/tweet")
    shareUrl.searchParams.set("text", text)
    shareUrl.searchParams.set("url", url)
    shareUrl.searchParams.set("hashtags", "音当てゲーム,音感トレーニング")

    try {
      const opened = window.open(
        shareUrl.toString(),
        "_blank",
        "noopener,noreferrer"
      )

      if (opened) {
        setShareMessage("Xの投稿画面を開きました")
        return
      }

      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShareMessage("投稿文をコピーしました")
    } catch {
      setShareMessage("シェアできませんでした")
    }
  }, [state])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
        return
      if (e.code === "Space" && !isGameComplete) {
        e.preventDefault()
        handlePlay()
        return
      }
      if (state.currentNote && state.lastResult === null) {
        const key = e.key.toUpperCase()
        const note = currentNotes.find((n) => n.label.toUpperCase() === key)
        if (note) handleAnswer(note.id)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    handlePlay,
    handleAnswer,
    state.currentNote,
    state.lastResult,
    currentNotes,
    isGameComplete,
  ])

  const canAnswer =
    state.currentNote !== null && state.lastResult === null && !isGameComplete

  return (
    <section id="game" className="page" aria-labelledby="game-title">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          flexWrap: "wrap",
          borderTop: "1px solid var(--rule)",
          paddingTop: ".75rem",
          marginBottom: "clamp(1.5rem, 4vw, 3rem)",
        }}
      >
        <h2
          id="game-title"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900 }}
        >
          <span
            className="mono"
            style={{
              display: "block",
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            Track 01 — Pitch Quiz
          </span>
          音当てゲーム
        </h2>
        <p className="mono" style={{ color: "var(--text-muted)" }}>
          {DIFFICULTY_LABELS[state.difficulty]} /{" "}
          {WAVE_TYPE_LABELS[state.selectedWaveType]} / {GAME_LIMIT} Questions
        </p>
      </header>

      <div className="game-grid">
        <div
          className="game-stage"
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <ScoreBoard
            correctCount={state.correctCount}
            totalCount={state.totalCount}
            streak={state.streak}
            limit={GAME_LIMIT}
          />

          <WaveVisualizer isPlaying={isPlaying} />

          <div
            style={{
              display: "flex",
              gap: ".75rem",
              flexWrap: "wrap",
              alignItems: "stretch",
            }}
          >
            <button
              onClick={handlePlay}
              disabled={isPlaying || isGameComplete}
              style={{
                flex: "1 1 12rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".75rem",
                minHeight: "3.5rem",
                padding: ".875rem 2rem",
                borderRadius: 0,
                border: "1px solid var(--rule)",
                backgroundColor:
                  isPlaying || isGameComplete
                    ? "var(--surface)"
                    : "var(--text)",
                color:
                  isPlaying || isGameComplete
                    ? "var(--text-faint)"
                    : "var(--paper)",
                fontSize: "1.0625rem",
                fontWeight: "bold",
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: isPlaying ? "inherit" : "var(--accent)" }}
              >
                {isPlaying ? "■" : "▶"}
              </span>
              {isGameComplete
                ? "結果表示中"
                : state.currentNote
                  ? "次の問題"
                  : "再生"}
            </button>
            {state.currentNote && (
              <button
                onClick={handleReplay}
                disabled={isPlaying}
                style={{
                  minHeight: "3.5rem",
                  padding: ".75rem 1.25rem",
                  borderRadius: 0,
                  border: "1px solid var(--rule)",
                  backgroundColor: "var(--paper)",
                  color: isPlaying ? "var(--text-faint)" : "var(--text)",
                  fontSize: "1rem",
                }}
              >
                ↻ もう一度聴く
              </button>
            )}
          </div>

          {state.currentNote && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <PianoKeyboard
                notes={currentNotes}
                onAnswer={handleAnswer}
                disabled={!canAnswer}
                lastAnswer={state.lastAnswer}
                lastResult={state.lastResult}
                currentNote={state.currentNote}
              />
              <FeedbackMessage
                key={state.totalCount}
                result={state.lastResult}
                currentNote={state.currentNote}
              />
            </div>
          )}

          {isGameComplete && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
                padding: "1.25rem",
                backgroundColor: "var(--paper)",
                border: "1px solid var(--rule)",
                borderLeft: "6px solid var(--accent)",
              }}
            >
              <p className="mono" style={{ color: "var(--text-muted)" }}>
                Session Complete — 10問終了
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                {state.correctCount} / {GAME_LIMIT}問正解（正答率{accuracy}%）
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: ".9375rem" }}>
                結果をXでシェアして、次の練習目標にしよう。
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleShare}
              disabled={!isGameComplete}
              style={{
                padding: ".75rem 1.25rem",
                borderRadius: 0,
                border: `1px solid ${isGameComplete ? "var(--rule)" : "var(--border)"}`,
                backgroundColor: isGameComplete
                  ? "var(--accent)"
                  : "transparent",
                color: isGameComplete ? "var(--paper)" : "var(--text-faint)",
                fontSize: ".9375rem",
                fontWeight: "bold",
              }}
            >
              Xでシェア
            </button>
            {shareMessage && (
              <p style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>
                {shareMessage}
              </p>
            )}
            <button
              onClick={handleReset}
              style={{
                padding: ".75rem 1rem",
                borderRadius: 0,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: ".875rem",
                marginLeft: "auto",
              }}
            >
              リセット
            </button>
          </div>

          <p className="mono" style={{ color: "var(--text-faint)" }}>
            <kbd>Space</kbd> 再生 / <kbd>C</kbd>〜<kbd>B</kbd> 音名キーで回答
          </p>
        </div>

        <aside
          className="game-settings"
          aria-label="ゲーム設定"
          style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          <WaveTypeSelector
            value={state.selectedWaveType}
            onChange={handleWaveChange}
          />
          <DifficultySelector
            value={state.difficulty}
            onChange={handleDifficultyChange}
          />
        </aside>
      </div>
    </section>
  )
}
