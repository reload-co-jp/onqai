"use client"
import { FC, useState, useCallback, useRef, useEffect } from "react"
import type { Difficulty, Note } from "types/game"
import { NOTES, NOTES_HARD } from "lib/notes"
import { playTone } from "lib/audio"
import { detectPitch, centsFromTarget, freqToNote } from "lib/pitch"
import { DifficultySelector } from "components/game/DifficultySelector"

type Phase = "idle" | "listening" | "success" | "miss" | "complete"

type RoundResult = { note: Note; success: boolean }

const GAME_ROUNDS = 5
const SUCCESS_CENTS = 50
const HOLD_DURATION_MS = 1500

const DIFFICULTY_NOTES: Record<Difficulty, Note[]> = {
  easy: NOTES.filter((n) => ["C4", "E4", "G4", "A4"].includes(n.id)),
  normal: NOTES,
  hard: NOTES_HARD,
}

function pickRandomNote(notes: Note[], exclude?: Note): Note {
  const pool = notes.length > 1 ? notes.filter((n) => n.id !== exclude?.id) : notes
  return pool[Math.floor(Math.random() * pool.length)]
}

const meterColor = (cents: number) => {
  const abs = Math.abs(cents)
  if (abs <= SUCCESS_CENTS) return "#4ade80"
  if (abs <= 100) return "#facc15"
  return "#f87171"
}

export const VocalGamePanel: FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal")
  const [phase, setPhase] = useState<Phase>("idle")
  const [targetNote, setTargetNote] = useState<Note | null>(null)
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null)
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null)
  const [cents, setCents] = useState<number | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [micError, setMicError] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdStartRef = useRef<number | null>(null)
  const phaseRef = useRef<Phase>("idle")
  const targetNoteRef = useRef<Note | null>(null)

  phaseRef.current = phase
  targetNoteRef.current = targetNote

  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    streamRef.current = null
    audioCtxRef.current = null
    analyserRef.current = null
    holdStartRef.current = null
  }, [])

  const startMic = useCallback(async () => {
    setMicError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      streamRef.current = stream
      audioCtxRef.current = ctx
      analyserRef.current = analyser

      const buffer = new Float32Array(analyser.fftSize)

      const loop = () => {
        if (!analyserRef.current) return
        analyserRef.current.getFloatTimeDomainData(buffer)
        const freq = detectPitch(buffer, ctx.sampleRate)
        const target = targetNoteRef.current

        if (freq && target) {
          const c = centsFromTarget(freq, target.frequency)
          const { name, octave } = freqToNote(freq)
          setDetectedFreq(Math.round(freq))
          setDetectedLabel(`${name}${octave}`)
          setCents(c)

          if (Math.abs(c) <= SUCCESS_CENTS) {
            if (!holdStartRef.current) holdStartRef.current = performance.now()
            const elapsed = performance.now() - holdStartRef.current
            const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100)
            setHoldProgress(progress)

            if (elapsed >= HOLD_DURATION_MS && phaseRef.current === "listening") {
              setPhase("success")
              setHoldProgress(100)
              stopMic()
              return
            }
          } else {
            holdStartRef.current = null
            setHoldProgress(0)
          }
        } else {
          setDetectedFreq(null)
          setDetectedLabel(null)
          setCents(null)
          holdStartRef.current = null
          setHoldProgress(0)
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      setPhase("listening")
      rafRef.current = requestAnimationFrame(loop)
    } catch {
      setMicError("マイクへのアクセスを許可してください")
    }
  }, [stopMic])

  const handleStart = useCallback(() => {
    const notes = DIFFICULTY_NOTES[difficulty]
    const note = pickRandomNote(notes)
    setTargetNote(note)
    setDetectedFreq(null)
    setDetectedLabel(null)
    setCents(null)
    setHoldProgress(0)
    startMic()
  }, [difficulty, startMic])

  const handleSkip = useCallback(() => {
    stopMic()
    const target = targetNoteRef.current
    if (!target) return
    const next = [...results, { note: target, success: false }]
    setResults(next)
    setPhase(next.length >= GAME_ROUNDS ? "complete" : "miss")
  }, [results, stopMic])

  const handleNext = useCallback(() => {
    const target = targetNoteRef.current
    const wasSuccess = phaseRef.current === "success"
    const next = target ? [...results, { note: target, success: wasSuccess }] : results
    setResults(next)
    if (next.length >= GAME_ROUNDS) {
      setPhase("complete")
      return
    }
    const notes = DIFFICULTY_NOTES[difficulty]
    const nextNote = pickRandomNote(notes, target ?? undefined)
    setTargetNote(nextNote)
    setDetectedFreq(null)
    setDetectedLabel(null)
    setCents(null)
    setHoldProgress(0)
    stopMic()
    startMic()
  }, [results, difficulty, stopMic, startMic])

  const handleReset = useCallback(() => {
    stopMic()
    setPhase("idle")
    setTargetNote(null)
    setResults([])
    setDetectedFreq(null)
    setDetectedLabel(null)
    setCents(null)
    setHoldProgress(0)
    setMicError(null)
  }, [stopMic])

  const handlePlayReference = useCallback(() => {
    if (!targetNote) return
    playTone({ frequency: targetNote.frequency, type: "voice", duration: 1.5 })
  }, [targetNote])

  useEffect(() => () => stopMic(), [stopMic])

  const correctCount = results.filter((r) => r.success).length
  const roundIndex = results.length + (phase === "listening" || phase === "success" || phase === "miss" ? 1 : 0)

  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "0 1rem 3rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <DifficultySelector
        value={difficulty}
        onChange={(d) => {
          handleReset()
          setDifficulty(d)
        }}
      />

      {/* Target note */}
      {targetNote && phase !== "idle" && (
        <div
          style={{
            padding: "2rem 1.5rem",
            backgroundColor: "#1e1e2e",
            border: "1px solid #2d2460",
            borderRadius: ".75rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#7c6bf0", fontSize: ".8rem", letterSpacing: ".12em", marginBottom: ".5rem" }}>
            TARGET — 第{roundIndex}問 / {GAME_ROUNDS}問
          </p>
          <p style={{ fontSize: "4rem", fontWeight: "bold", color: "#f0f0f0", lineHeight: 1 }}>
            {targetNote.label}
          </p>
          <p style={{ color: "#aaa", fontSize: "1.25rem", marginTop: ".25rem" }}>{targetNote.solfege}</p>
          <p style={{ color: "#666", fontSize: ".875rem", marginTop: ".25rem" }}>{targetNote.frequency}Hz</p>
          <button
            onClick={handlePlayReference}
            style={{
              marginTop: "1rem",
              padding: ".5rem 1.25rem",
              border: "1px solid #555",
              borderRadius: ".375rem",
              backgroundColor: "transparent",
              color: "#aaa",
              cursor: "pointer",
              fontSize: ".875rem",
            }}
          >
            参考音を聴く
          </button>
        </div>
      )}

      {/* Pitch meter */}
      {phase === "listening" && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          <div
            style={{
              position: "relative",
              height: "3rem",
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: ".5rem",
              overflow: "hidden",
            }}
          >
            {/* Success zone */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "calc(50% - 8%)",
                width: "16%",
                height: "100%",
                backgroundColor: "#14532d33",
              }}
            />
            {/* Center line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: "2px",
                height: "100%",
                backgroundColor: "#4ade8044",
                transform: "translateX(-1px)",
              }}
            />
            {/* Needle */}
            {cents !== null && (
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  height: "80%",
                  width: "4px",
                  borderRadius: "2px",
                  backgroundColor: meterColor(cents),
                  left: `calc(50% + ${Math.max(-45, Math.min(45, cents / 3))}%)`,
                  transform: "translateX(-2px)",
                  transition: "left .08s linear",
                }}
              />
            )}
            {/* Labels */}
            <span
              style={{
                position: "absolute",
                left: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: ".7rem",
                color: "#555",
              }}
            >
              低
            </span>
            <span
              style={{
                position: "absolute",
                right: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: ".7rem",
                color: "#555",
              }}
            >
              高
            </span>
          </div>

          {/* Detected note info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: ".75rem 1rem",
              backgroundColor: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: ".5rem",
              fontSize: ".9rem",
            }}
          >
            <span style={{ color: "#666" }}>検出</span>
            {detectedFreq ? (
              <span style={{ color: "#f0f0f0", fontWeight: "bold" }}>
                {detectedLabel} — {detectedFreq}Hz
              </span>
            ) : (
              <span style={{ color: "#444" }}>音が検出されていません</span>
            )}
            {cents !== null && (
              <span style={{ color: meterColor(cents), fontWeight: "bold", fontSize: ".85rem" }}>
                {cents > 0 ? `+${cents}` : cents}¢
              </span>
            )}
          </div>

          {/* Hold progress */}
          {holdProgress > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
                <span style={{ fontSize: ".8rem", color: "#4ade80" }}>キープ中...</span>
                <span style={{ fontSize: ".8rem", color: "#4ade80" }}>{Math.round(holdProgress)}%</span>
              </div>
              <div
                style={{
                  height: "6px",
                  backgroundColor: "#1a1a1a",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${holdProgress}%`,
                    backgroundColor: "#4ade80",
                    borderRadius: "3px",
                    transition: "width .1s linear",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success / Miss feedback */}
      {phase === "success" && (
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "#14532d22",
            border: "1px solid #4ade80",
            borderRadius: ".5rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#4ade80" }}>成功!</p>
          <p style={{ color: "#aaa", fontSize: ".875rem", marginTop: ".25rem" }}>
            {targetNote?.label}({targetNote?.solfege}) を正確に歌えた
          </p>
        </div>
      )}

      {phase === "miss" && (
        <div
          style={{
            padding: "1.25rem",
            backgroundColor: "#7f1d1d22",
            border: "1px solid #f87171",
            borderRadius: ".5rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f87171" }}>スキップ</p>
          <p style={{ color: "#aaa", fontSize: ".875rem", marginTop: ".25rem" }}>
            正解は {targetNote?.label}({targetNote?.solfege}) — {targetNote?.frequency}Hz
          </p>
        </div>
      )}

      {/* Action buttons */}
      {phase === "idle" && (
        <button
          onClick={handleStart}
          style={{
            padding: "1rem",
            borderRadius: ".5rem",
            border: "none",
            backgroundColor: "#7c6bf0",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          マイクで歌う
        </button>
      )}

      {phase === "listening" && (
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1,
              padding: ".75rem",
              borderRadius: ".5rem",
              border: "1px solid #555",
              backgroundColor: "transparent",
              color: "#aaa",
              cursor: "pointer",
              fontSize: ".9375rem",
            }}
          >
            スキップ
          </button>
        </div>
      )}

      {(phase === "success" || phase === "miss") && (
        <button
          onClick={handleNext}
          style={{
            padding: "1rem",
            borderRadius: ".5rem",
            border: "none",
            backgroundColor: "#7c6bf0",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {results.length + 1 >= GAME_ROUNDS ? "結果を見る" : "次の音"}
        </button>
      )}

      {/* Progress dots */}
      {(phase !== "idle" && phase !== "complete") && (
        <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
          {Array.from({ length: GAME_ROUNDS }).map((_, i) => {
            const r = results[i]
            return (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: r ? (r.success ? "#4ade80" : "#f87171") : i === results.length ? "#7c6bf0" : "#333",
                }}
              />
            )
          })}
        </div>
      )}

      {/* Error */}
      {micError && (
        <p style={{ color: "#f87171", fontSize: ".875rem", textAlign: "center" }}>{micError}</p>
      )}

      {/* Complete */}
      {phase === "complete" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1.5rem",
            backgroundColor: "#1e1e2e",
            border: "1px solid #7c6bf0",
            borderRadius: ".75rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#7c6bf0", fontSize: ".8rem", letterSpacing: ".1em" }}>RESULT</p>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f0f0f0" }}>
            {correctCount} / {GAME_ROUNDS}
          </p>
          <div style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: ".25rem",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: r.success ? "#4ade80" : "#f87171",
                  }}
                />
                <span style={{ fontSize: ".7rem", color: "#666" }}>{r.note.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: ".75rem 2rem",
              borderRadius: ".5rem",
              border: "none",
              backgroundColor: "#7c6bf0",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            もう一度
          </button>
        </div>
      )}
    </div>
  )
}
