"use client"
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { playTone } from "lib/audio"
import { centsFromTarget, detectPitch, freqToNote } from "lib/pitch"
import type { Note } from "types/game"

type Phase = "idle" | "listening" | "success" | "miss" | "complete"
type Result = { note: Note; success: boolean }

const SUCCESS_CENTS = 55
const HOLD_DURATION_MS = 650
const BEAT_MS = 520

const NOTE_BANK: Record<string, Note> = {
  C4: { id: "C4", label: "C", solfege: "ド", frequency: 261.63 },
  D4: { id: "D4", label: "D", solfege: "レ", frequency: 293.66 },
  E4: { id: "E4", label: "E", solfege: "ミ", frequency: 329.63 },
  G4: { id: "G4", label: "G", solfege: "ソ", frequency: 392.0 },
  A4: { id: "A4", label: "A", solfege: "ラ", frequency: 440.0 },
  B4: { id: "B4", label: "B", solfege: "シ", frequency: 493.88 },
  C5: { id: "C5", label: "C", solfege: "ド", frequency: 523.25 },
  D5: { id: "D5", label: "D", solfege: "レ", frequency: 587.33 },
}

const KIMIGAYO_NOTE_IDS = [
  "D4",
  "C4",
  "D4",
  "E4",
  "G4",
  "E4",
  "D4",
  "E4",
  "G4",
  "A4",
  "G4",
  "A4",
  "D5",
  "B4",
  "A4",
  "G4",
  "E4",
  "G4",
  "A4",
  "D5",
  "C5",
  "D5",
  "E4",
  "G4",
  "A4",
  "G4",
  "E4",
  "G4",
  "D4",
  "A4",
  "C5",
  "D5",
  "C5",
  "D5",
  "A4",
  "G4",
  "A4",
  "G4",
  "E4",
  "D4",
] as const

const KIMIGAYO_DURATIONS = [
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  1,
  1,
  1,
  0.5,
  0.5,
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  1,
  1,
  2,
  1,
  1,
  1,
  1,
  1.5,
  0.5,
  2,
  1,
  1,
  2,
  1,
  1,
  1,
  1,
  1,
  0.5,
  0.5,
  2,
]

const KIMIGAYO_NOTES = KIMIGAYO_NOTE_IDS.map((id) => NOTE_BANK[id])

const meterColor = (cents: number) => {
  const abs = Math.abs(cents)
  if (abs <= SUCCESS_CENTS) return "#4ade80"
  if (abs <= 110) return "#facc15"
  return "#f87171"
}

export const KimigayoVocalPanel: FC = () => {
  const [phase, setPhase] = useState<Phase>("idle")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null)
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null)
  const [cents, setCents] = useState<number | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [micError, setMicError] = useState<string | null>(null)
  const [isPlayingReference, setIsPlayingReference] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const holdStartRef = useRef<number | null>(null)
  const phaseRef = useRef<Phase>("idle")
  const currentIndexRef = useRef(0)
  const timersRef = useRef<number[]>([])

  const currentNote = KIMIGAYO_NOTES[currentIndex]
  const completeCount = results.filter((result) => result.success).length
  const noteLine = useMemo(() => KIMIGAYO_NOTES.map((note) => note.solfege).join(" "), [])

  useEffect(() => {
    phaseRef.current = phase
    currentIndexRef.current = currentIndex
  })

  const clearReferenceTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    setIsPlayingReference(false)
  }, [])

  const stopMic = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    audioCtxRef.current?.close()
    streamRef.current = null
    audioCtxRef.current = null
    analyserRef.current = null
    rafRef.current = null
    holdStartRef.current = null
  }, [])

  const resetDetection = useCallback(() => {
    setDetectedFreq(null)
    setDetectedLabel(null)
    setCents(null)
    setHoldProgress(0)
    holdStartRef.current = null
  }, [])

  const finishCurrentNote = useCallback(
    (success: boolean) => {
      stopMic()
      const note = KIMIGAYO_NOTES[currentIndexRef.current]
      setResults((prev) => [...prev, { note, success }])
      setPhase(success ? "success" : "miss")
      setHoldProgress(success ? 100 : 0)
    },
    [stopMic]
  )

  const startMic = useCallback(async () => {
    setMicError(null)
    resetDetection()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      ctx.createMediaStreamSource(stream).connect(analyser)

      streamRef.current = stream
      audioCtxRef.current = ctx
      analyserRef.current = analyser

      const buffer = new Float32Array(analyser.fftSize)
      const loop = () => {
        if (!analyserRef.current) return
        analyserRef.current.getFloatTimeDomainData(buffer)

        const freq = detectPitch(buffer, ctx.sampleRate)
        const target = KIMIGAYO_NOTES[currentIndexRef.current]

        if (freq && target) {
          const diff = centsFromTarget(freq, target.frequency)
          const detected = freqToNote(freq)
          setDetectedFreq(Math.round(freq))
          setDetectedLabel(`${detected.name}${detected.octave}`)
          setCents(diff)

          if (Math.abs(diff) <= SUCCESS_CENTS) {
            if (!holdStartRef.current) holdStartRef.current = performance.now()
            const elapsed = performance.now() - holdStartRef.current
            setHoldProgress(Math.min((elapsed / HOLD_DURATION_MS) * 100, 100))

            if (elapsed >= HOLD_DURATION_MS && phaseRef.current === "listening") {
              finishCurrentNote(true)
              return
            }
          } else {
            holdStartRef.current = null
            setHoldProgress(0)
          }
        } else {
          resetDetection()
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      setPhase("listening")
      rafRef.current = requestAnimationFrame(loop)
    } catch {
      setMicError("マイクへのアクセスを許可してください")
    }
  }, [finishCurrentNote, resetDetection])

  const handleStart = useCallback(() => {
    clearReferenceTimers()
    setCurrentIndex(0)
    setResults([])
    startMic()
  }, [clearReferenceTimers, startMic])

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= KIMIGAYO_NOTES.length) {
      setPhase("complete")
      return
    }
    setCurrentIndex(nextIndex)
    startMic()
  }, [currentIndex, startMic])

  const handleSkip = useCallback(() => finishCurrentNote(false), [finishCurrentNote])

  const handleReset = useCallback(() => {
    clearReferenceTimers()
    stopMic()
    resetDetection()
    setPhase("idle")
    setCurrentIndex(0)
    setResults([])
    setMicError(null)
  }, [clearReferenceTimers, resetDetection, stopMic])

  const handlePlayReferenceNote = useCallback(() => {
    playTone({ frequency: currentNote.frequency, type: "voice", duration: 1, volume: 0.24 })
  }, [currentNote])

  const handlePlayReferenceMelody = useCallback(() => {
    clearReferenceTimers()
    setIsPlayingReference(true)
    let elapsed = 0
    KIMIGAYO_NOTES.forEach((note, index) => {
      const durationMs = KIMIGAYO_DURATIONS[index] * BEAT_MS
      const timer = window.setTimeout(() => {
        playTone({
          frequency: note.frequency,
          type: "voice",
          duration: Math.max(0.18, durationMs / 1000 - 0.04),
          volume: 0.22,
        })
      }, elapsed)
      timersRef.current.push(timer)
      elapsed += durationMs
    })
    const doneTimer = window.setTimeout(() => {
      timersRef.current = []
      setIsPlayingReference(false)
    }, elapsed + 120)
    timersRef.current.push(doneTimer)
  }, [clearReferenceTimers])

  useEffect(() => () => {
    clearReferenceTimers()
    stopMic()
  }, [clearReferenceTimers, stopMic])

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "0 1rem 4rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: ".5rem",
          color: "#aaa",
          lineHeight: 1.8,
        }}
      >
        <p style={{ margin: 0, fontSize: ".9rem" }}>{noteLine}</p>
      </div>

      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <button
          onClick={handlePlayReferenceMelody}
          disabled={isPlayingReference}
          style={{
            padding: ".75rem 1.25rem",
            borderRadius: ".5rem",
            border: "1px solid #555",
            backgroundColor: "transparent",
            color: "#f0f0f0",
            cursor: isPlayingReference ? "not-allowed" : "pointer",
            fontSize: ".95rem",
          }}
        >
          {isPlayingReference ? "再生中" : "参考メロディ"}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: ".75rem 1rem",
            borderRadius: ".5rem",
            border: "1px solid #555",
            backgroundColor: "transparent",
            color: "#888",
            cursor: "pointer",
            fontSize: ".9rem",
            marginLeft: "auto",
          }}
        >
          リセット
        </button>
      </div>

      {phase !== "idle" && (
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
            KIMIGAYO — {Math.min(currentIndex + 1, KIMIGAYO_NOTES.length)} / {KIMIGAYO_NOTES.length}
          </p>
          <p style={{ fontSize: "4rem", fontWeight: "bold", color: "#f0f0f0", lineHeight: 1 }}>
            {currentNote.label}
          </p>
          <p style={{ color: "#aaa", fontSize: "1.25rem", marginTop: ".25rem" }}>{currentNote.solfege}</p>
          <p style={{ color: "#666", fontSize: ".875rem", marginTop: ".25rem" }}>{currentNote.frequency}Hz</p>
          <button
            onClick={handlePlayReferenceNote}
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
            参考音
          </button>
        </div>
      )}

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
            <span style={{ position: "absolute", left: "4px", top: "50%", transform: "translateY(-50%)", fontSize: ".7rem", color: "#555" }}>
              低
            </span>
            <span style={{ position: "absolute", right: "4px", top: "50%", transform: "translateY(-50%)", fontSize: ".7rem", color: "#555" }}>
              高
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".75rem",
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
              <span style={{ color: "#444" }}>音なし</span>
            )}
            {cents !== null && (
              <span style={{ color: meterColor(cents), fontWeight: "bold", fontSize: ".85rem" }}>
                {cents > 0 ? `+${cents}` : cents}¢
              </span>
            )}
          </div>

          {holdProgress > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
                <span style={{ fontSize: ".8rem", color: "#4ade80" }}>キープ中</span>
                <span style={{ fontSize: ".8rem", color: "#4ade80" }}>{Math.round(holdProgress)}%</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#1a1a1a", borderRadius: "3px", overflow: "hidden" }}>
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

      {phase === "success" && (
        <p style={{ color: "#4ade80", fontWeight: 700, textAlign: "center" }}>
          成功: {currentNote.label}({currentNote.solfege})
        </p>
      )}

      {phase === "miss" && (
        <p style={{ color: "#f87171", fontWeight: 700, textAlign: "center" }}>
          スキップ: {currentNote.label}({currentNote.solfege})
        </p>
      )}

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
        <button
          onClick={handleSkip}
          style={{
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
          {currentIndex + 1 >= KIMIGAYO_NOTES.length ? "結果" : "次の音"}
        </button>
      )}

      {micError && <p style={{ color: "#f87171", fontSize: ".875rem", textAlign: "center" }}>{micError}</p>}

      <div style={{ display: "flex", gap: ".25rem", flexWrap: "wrap", justifyContent: "center" }}>
        {KIMIGAYO_NOTES.map((note, index) => {
          const result = results[index]
          const active = phase !== "idle" && phase !== "complete" && index === currentIndex
          return (
            <span
              key={`${note.id}-${index}`}
              style={{
                minWidth: "1.55rem",
                height: "1.55rem",
                borderRadius: ".375rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: ".75rem",
                fontWeight: 700,
                color: result ? "#111" : active ? "#fff" : "#777",
                backgroundColor: result ? (result.success ? "#4ade80" : "#f87171") : active ? "#7c6bf0" : "#202020",
              }}
            >
              {note.solfege}
            </span>
          )
        })}
      </div>

      {phase === "complete" && (
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#1e1e2e",
            border: "1px solid #7c6bf0",
            borderRadius: ".75rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#7c6bf0", fontSize: ".8rem", letterSpacing: ".1em" }}>RESULT</p>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f0f0f0" }}>
            {completeCount} / {KIMIGAYO_NOTES.length}
          </p>
          <button
            onClick={handleReset}
            style={{
              marginTop: "1rem",
              padding: ".75rem 1.5rem",
              borderRadius: ".5rem",
              border: "none",
              backgroundColor: "#7c6bf0",
              color: "#fff",
              cursor: "pointer",
              fontSize: ".95rem",
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
