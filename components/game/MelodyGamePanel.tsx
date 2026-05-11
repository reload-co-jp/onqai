"use client"
import { FC, useCallback, useMemo, useRef, useState } from "react"
import type { OscillatorWaveType } from "types/game"
import { playTone } from "lib/audio"
import {
  MELODIES,
  MELODY_NOTE_FREQUENCIES,
  melodyAnswer,
  type Melody,
} from "lib/melodies"
import { WaveTypeSelector } from "components/game/WaveTypeSelector"

type Result = "correct" | "wrong" | null

type MelodyGameState = {
  current: Melody | null
  options: Melody[]
  correctCount: number
  totalCount: number
  streak: number
  selectedId: string | null
  result: Result
  selectedWaveType: OscillatorWaveType
}

const initialState: MelodyGameState = {
  current: null,
  options: [],
  correctCount: 0,
  totalCount: 0,
  streak: 0,
  selectedId: null,
  result: null,
  selectedWaveType: "piano",
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

function createQuestion(): Pick<MelodyGameState, "current" | "options" | "selectedId" | "result"> {
  const current = MELODIES[Math.floor(Math.random() * MELODIES.length)]
  const distractors = shuffle(MELODIES.filter((melody) => melody.id !== current.id)).slice(0, 3)

  return {
    current,
    options: shuffle([current, ...distractors]),
    selectedId: null,
    result: null,
  }
}

const statStyle: React.CSSProperties = {
  padding: ".875rem",
  border: "1px solid #333",
  borderRadius: ".5rem",
  backgroundColor: "#1b1b1b",
  minWidth: "6rem",
  textAlign: "center",
}

export const MelodyGamePanel: FC = () => {
  const [state, setState] = useState<MelodyGameState>(initialState)
  const [isPlaying, setIsPlaying] = useState(false)
  const timers = useRef<number[]>([])
  const current = state.current
  const result = state.result

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const playMelody = useCallback(
    (melody: Melody) => {
      clearTimers()
      setIsPlaying(true)

      const beatMs = 360
      let elapsedMs = 0
      melody.notes.forEach((note, index) => {
        const durationBeats = melody.durations[index] ?? 1
        const noteMs = durationBeats * beatMs
        const timer = window.setTimeout(() => {
          playTone({
            frequency: MELODY_NOTE_FREQUENCIES[note],
            type: state.selectedWaveType,
            duration: Math.max(0.18, noteMs / 1000 - 0.04),
            volume: 0.28,
          })
        }, elapsedMs)
        timers.current.push(timer)
        elapsedMs += noteMs
      })

      const doneTimer = window.setTimeout(() => {
        setIsPlaying(false)
        timers.current = []
      }, elapsedMs + 120)
      timers.current.push(doneTimer)
    },
    [clearTimers, state.selectedWaveType]
  )

  const handleStart = useCallback(() => {
    const question = createQuestion()
    setState((prev) => ({ ...prev, ...question }))
    playMelody(question.current)
  }, [playMelody])

  const handleReplay = useCallback(() => {
    if (!current || isPlaying) return
    playMelody(current)
  }, [current, isPlaying, playMelody])

  const handleAnswer = useCallback(
    (melodyId: string) => {
      if (!current || result !== null) return

      const correct = melodyId === current.id
      setState((prev) => ({
        ...prev,
        selectedId: melodyId,
        result: correct ? "correct" : "wrong",
        correctCount: correct ? prev.correctCount + 1 : prev.correctCount,
        totalCount: prev.totalCount + 1,
        streak: correct ? prev.streak + 1 : 0,
      }))
    },
    [current, result]
  )

  const handleReset = useCallback(() => {
    clearTimers()
    setIsPlaying(false)
    setState(initialState)
  }, [clearTimers])

  const handleWaveChange = useCallback((type: OscillatorWaveType) => {
    setState((prev) => ({ ...prev, selectedWaveType: type }))
  }, [])

  const accuracy = useMemo(() => {
    if (state.totalCount === 0) return 0
    return Math.round((state.correctCount / state.totalCount) * 100)
  }, [state.correctCount, state.totalCount])

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "2.5rem 1rem 4rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div>
        <p
          style={{
            color: "#7c6bf0",
            fontSize: ".8rem",
            fontWeight: 700,
            letterSpacing: ".12em",
            marginBottom: ".75rem",
            textTransform: "uppercase",
          }}
        >
          Melody
        </p>
        <h1 style={{ color: "#f0f0f0", fontSize: "2rem", lineHeight: 1.35, marginBottom: ".75rem" }}>
          童謡・民謡メロディ音階ゲーム
        </h1>
        <p style={{ color: "#aaa", lineHeight: 1.8 }}>
          短いメロディを聴いて、同じドレミ並びを選ぶ練習。
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
          gap: ".75rem",
        }}
      >
        <div style={statStyle}>
          <div style={{ color: "#888", fontSize: ".8rem", marginBottom: ".35rem" }}>正解</div>
          <div style={{ color: "#f0f0f0", fontSize: "1.35rem", fontWeight: 700 }}>
            {state.correctCount}/{state.totalCount}
          </div>
        </div>
        <div style={statStyle}>
          <div style={{ color: "#888", fontSize: ".8rem", marginBottom: ".35rem" }}>正答率</div>
          <div style={{ color: "#f0f0f0", fontSize: "1.35rem", fontWeight: 700 }}>{accuracy}%</div>
        </div>
        <div style={statStyle}>
          <div style={{ color: "#888", fontSize: ".8rem", marginBottom: ".35rem" }}>連続</div>
          <div style={{ color: "#f0f0f0", fontSize: "1.35rem", fontWeight: 700 }}>{state.streak}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
        <WaveTypeSelector value={state.selectedWaveType} onChange={handleWaveChange} />
      </div>

      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
        <button
          onClick={handleStart}
          disabled={isPlaying}
          style={{
            padding: ".75rem 1.75rem",
            borderRadius: ".5rem",
            border: "none",
            backgroundColor: isPlaying ? "#4a4080" : "#7c6bf0",
            color: "#fff",
            cursor: isPlaying ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          {state.current ? "次のメロディ" : "開始"}
        </button>
        {state.current && (
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

      {state.current && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <h2 style={{ color: "#f0f0f0", fontSize: "1rem" }}>音階を選ぶ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: ".75rem" }}>
            {state.options.map((melody) => {
              const selected = state.selectedId === melody.id
              const isCorrect = state.result !== null && melody.id === state.current?.id
              const isWrong = selected && state.result === "wrong"

              return (
                <button
                  key={melody.id}
                  onClick={() => handleAnswer(melody.id)}
                  disabled={state.result !== null}
                  style={{
                    minHeight: "5.75rem",
                    padding: "1rem",
                    borderRadius: ".5rem",
                    border: `1px solid ${isCorrect ? "#31c48d" : isWrong ? "#f05252" : "#444"}`,
                    backgroundColor: isCorrect ? "#12382d" : isWrong ? "#3c1b1b" : "#1b1b1b",
                    color: "#f0f0f0",
                    cursor: state.result === null ? "pointer" : "default",
                    textAlign: "left",
                  }}
                >
                  <span style={{ display: "block", fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.7 }}>
                    {melodyAnswer(melody)}
                  </span>
                  {state.result !== null && (
                    <span style={{ color: "#999", display: "block", fontSize: ".85rem", marginTop: ".35rem" }}>
                      {melody.title} / {melody.origin}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {state.result && (
            <p
              style={{
                color: state.result === "correct" ? "#31c48d" : "#f05252",
                fontWeight: 700,
                lineHeight: 1.7,
              }}
            >
              {state.result === "correct"
                ? `正解: ${state.current.title}`
                : `不正解。正解: ${melodyAnswer(state.current)} / ${state.current.title}`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
