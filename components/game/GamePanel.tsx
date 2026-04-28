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
  sine: "サイン波",
  square: "矩形波",
  sawtooth: "のこぎり波",
  triangle: "三角波",
}

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

  const playNote = useCallback(
    (frequency: number, waveType: OscillatorWaveType) => {
      setIsPlaying(true)
      playTone({ frequency, type: waveType })
      setTimeout(() => setIsPlaying(false), 1100)
    },
    []
  )

  const handlePlay = useCallback(() => {
    const note = getRandomNote(currentNotes)
    setState((prev) => ({
      ...prev,
      currentNote: note,
      lastAnswer: null,
      lastResult: null,
    }))
    playNote(note.frequency, state.selectedWaveType)
  }, [currentNotes, state.selectedWaveType, playNote])

  const handleReplay = useCallback(() => {
    if (!state.currentNote || isPlaying) return
    playNote(state.currentNote.frequency, state.selectedWaveType)
  }, [state.currentNote, state.selectedWaveType, isPlaying, playNote])

  const handleAnswer = useCallback(
    (noteId: string) => {
      if (!state.currentNote || state.lastResult !== null) return
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
    [state.currentNote, state.lastResult]
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
      const opened = window.open(shareUrl.toString(), "_blank", "noopener,noreferrer")

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return
      if (e.code === "Space") {
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
  }, [handlePlay, handleAnswer, state.currentNote, state.lastResult, currentNotes])

  const canAnswer = state.currentNote !== null && state.lastResult === null

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 1rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <WaveTypeSelector value={state.selectedWaveType} onChange={handleWaveChange} />
        <DifficultySelector value={state.difficulty} onChange={handleDifficultyChange} />
      </div>

      <WaveVisualizer isPlaying={isPlaying} />

      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          style={{
            padding: ".75rem 2rem",
            borderRadius: ".5rem",
            border: "none",
            backgroundColor: isPlaying ? "#4a4080" : "#7c6bf0",
            color: "#fff",
            cursor: isPlaying ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {state.currentNote ? "次の問題" : "再生"}
        </button>
        {state.currentNote && (
          <button
            onClick={handleReplay}
            disabled={isPlaying}
            style={{
              padding: ".75rem 1.25rem",
              borderRadius: ".5rem",
              border: "1px solid #555",
              backgroundColor: "transparent",
              color: "#f0f0f0",
              cursor: isPlaying ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            もう一度聴く
          </button>
        )}
        <button
          onClick={handleReset}
          style={{
            padding: ".75rem 1rem",
            borderRadius: ".5rem",
            border: "1px solid #555",
            backgroundColor: "transparent",
            color: "#888",
            cursor: "pointer",
            fontSize: ".875rem",
            marginLeft: "auto",
          }}
        >
          リセット
        </button>
      </div>

      {state.currentNote && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <PianoKeyboard
            notes={currentNotes}
            onAnswer={handleAnswer}
            disabled={!canAnswer}
            lastAnswer={state.lastAnswer}
            lastResult={state.lastResult}
            currentNote={state.currentNote}
          />
          <FeedbackMessage result={state.lastResult} currentNote={state.currentNote} />
        </div>
      )}

      <ScoreBoard
        correctCount={state.correctCount}
        totalCount={state.totalCount}
        streak={state.streak}
      />

      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
        <button
          onClick={handleShare}
          disabled={state.totalCount === 0}
          style={{
            padding: ".75rem 1.25rem",
            borderRadius: ".5rem",
            border: "1px solid #7c6bf0",
            backgroundColor: state.totalCount === 0 ? "#2a2a2a" : "#2d2460",
            color: state.totalCount === 0 ? "#666" : "#f0f0f0",
            cursor: state.totalCount === 0 ? "not-allowed" : "pointer",
            fontSize: ".9375rem",
            fontWeight: "bold",
          }}
        >
          Xでシェア
        </button>
        {shareMessage && <p style={{ color: "#aaa", fontSize: ".875rem" }}>{shareMessage}</p>}
      </div>

      <p style={{ fontSize: ".75rem", color: "#555", textAlign: "center" }}>
        スペースキーで再生 / 音名キー（C〜B）で回答
      </p>
    </div>
  )
}
