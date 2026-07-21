"use client"
import { FC, useCallback, useRef, useState } from "react"
import type { OscillatorWaveType } from "types/game"
import { playTone } from "lib/audio"
import { chordFrequencies, PROGRESSIONS, type Chord } from "lib/chords"
import { WaveTypeSelector } from "components/game/WaveTypeSelector"

const CHORD_DURATION = 0.85
const CHORD_INTERVAL_MS = 750

const playChord = (chord: Chord, waveType: OscillatorWaveType) => {
  chordFrequencies(chord).forEach((frequency) => {
    playTone({ frequency, type: waveType, duration: CHORD_DURATION, volume: 0.22 })
  })
}

export const ChordProgressionPanel: FC = () => {
  const [waveType, setWaveType] = useState<OscillatorWaveType>("piano")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const stopScheduled = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const handlePlay = useCallback(
    (progressionId: string, chords: Chord[]) => {
      if (playingId) return
      stopScheduled()
      setPlayingId(progressionId)

      chords.forEach((chord, index) => {
        const timeout = setTimeout(() => {
          setActiveIndex(index)
          playChord(chord, waveType)
        }, index * CHORD_INTERVAL_MS)
        timeoutsRef.current.push(timeout)
      })

      const endTimeout = setTimeout(
        () => {
          setPlayingId(null)
          setActiveIndex(-1)
        },
        chords.length * CHORD_INTERVAL_MS + 200
      )
      timeoutsRef.current.push(endTimeout)
    },
    [playingId, stopScheduled, waveType]
  )

  return (
    <div
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "2.5rem 1.25rem 4rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <div>
        <h1
          style={{
            color: "#f0f0f0",
            fontSize: "clamp(1.75rem, 5vw, 2.4rem)",
            fontWeight: "bold",
            lineHeight: 1.3,
            marginBottom: ".75rem",
          }}
        >
          コード進行の差を聴き比べる
        </h1>
        <p style={{ color: "#aaa", fontSize: ".9375rem", lineHeight: 1.8 }}>
          同じCメジャーのキーでも、コードの並べ方（進行）が変わると響きの印象が大きく変わります。
          再生ボタンでそれぞれの進行を聴き、明るさ・切なさ・解決感の違いを比べてみましょう。
        </p>
      </div>

      <WaveTypeSelector value={waveType} onChange={setWaveType} />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {PROGRESSIONS.map((progression) => {
          const isPlaying = playingId === progression.id
          return (
            <section
              key={progression.id}
              style={{
                padding: "1.25rem",
                backgroundColor: "#1e1e2e",
                border: `1px solid ${isPlaying ? "#7c6bf0" : "#333"}`,
                borderRadius: ".5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2 style={{ color: "#f0f0f0", fontSize: "1.125rem", fontWeight: "bold" }}>
                    {progression.name}
                  </h2>
                  <p style={{ color: "#7c6bf0", fontSize: ".8125rem", marginTop: ".25rem" }}>
                    {progression.mood}
                  </p>
                </div>
                <button
                  onClick={() => handlePlay(progression.id, progression.chords)}
                  disabled={playingId !== null}
                  style={{
                    padding: ".5rem 1.25rem",
                    borderRadius: ".375rem",
                    border: "none",
                    backgroundColor: playingId !== null ? "#444" : "#7c6bf0",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: ".875rem",
                    cursor: playingId !== null ? "default" : "pointer",
                  }}
                >
                  {isPlaying ? "再生中" : "再生する"}
                </button>
              </div>

              <p style={{ color: "#bbb", fontSize: ".9375rem", lineHeight: 1.7, margin: "1rem 0" }}>
                {progression.description}
              </p>

              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {progression.chords.map((chord, index) => (
                  <span
                    key={`${chord.id}-${index}`}
                    style={{
                      padding: ".375rem .75rem",
                      borderRadius: ".375rem",
                      fontSize: ".9375rem",
                      fontWeight: "bold",
                      color: isPlaying && activeIndex === index ? "#fff" : "#ccc",
                      backgroundColor: isPlaying && activeIndex === index ? "#7c6bf0" : "#2a2a2a",
                      border: "1px solid #444",
                      transition: "background-color .1s, color .1s",
                    }}
                  >
                    {chord.label}
                  </span>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
