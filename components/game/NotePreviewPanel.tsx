"use client"
import { FC, useCallback, useState } from "react"
import type { OscillatorWaveType } from "types/game"
import { playTone } from "lib/audio"
import { NOTES_HARD } from "lib/notes"
import { PianoKeyboard } from "components/game/PianoKeyboard"
import { WaveTypeSelector } from "components/game/WaveTypeSelector"
import { WaveVisualizer } from "components/game/WaveVisualizer"

export const NotePreviewPanel: FC = () => {
  const [selectedWaveType, setSelectedWaveType] = useState<OscillatorWaveType>("sine")
  const [isPlaying, setIsPlaying] = useState(false)
  const [previewNoteId, setPreviewNoteId] = useState<string | null>(null)

  const handlePreviewNote = useCallback(
    (noteId: string) => {
      const note = NOTES_HARD.find((n) => n.id === noteId)
      if (!note || isPlaying) return

      setPreviewNoteId(note.id)
      setIsPlaying(true)
      playTone({ frequency: note.frequency, type: selectedWaveType })
      setTimeout(() => setIsPlaying(false), 1100)
    },
    [isPlaying, selectedWaveType]
  )

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "2.5rem 1rem 4rem",
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
          音を確認する
        </h1>
        <p style={{ color: "#aaa", fontSize: ".9375rem", lineHeight: 1.8 }}>
          鍵盤を押すと、その音だけを再生できます。問題とは別に音の高さを確認できます。
        </p>
      </div>

      <WaveTypeSelector value={selectedWaveType} onChange={setSelectedWaveType} />
      <WaveVisualizer isPlaying={isPlaying} />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".75rem",
          padding: "1rem",
          backgroundColor: "#1e1e2e",
          border: "1px solid #333",
          borderRadius: ".5rem",
        }}
      >
        <PianoKeyboard
          notes={NOTES_HARD}
          onAnswer={handlePreviewNote}
          disabled={isPlaying}
          lastAnswer={previewNoteId}
          lastResult={previewNoteId ? "correct" : null}
          currentNote={null}
        />
      </section>
    </div>
  )
}
