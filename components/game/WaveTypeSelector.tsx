"use client"
import { FC } from "react"
import type { OscillatorWaveType } from "types/game"

const WAVE_TYPES: { value: OscillatorWaveType; label: string }[] = [
  { value: "piano", label: "ピアノ" },
  { value: "organ", label: "オルガン" },
  { value: "guitar", label: "ギター" },
  { value: "trumpet", label: "トランペット" },
  { value: "oboe", label: "オーボエ" },
  { value: "voice", label: "声色" },
  { value: "sine", label: "サイン波" },
  { value: "square", label: "矩形波" },
  { value: "sawtooth", label: "のこぎり波" },
  { value: "triangle", label: "三角波" },
]

type Props = {
  value: OscillatorWaveType
  onChange: (type: OscillatorWaveType) => void
}

export const WaveTypeSelector: FC<Props> = ({ value, onChange }) => (
  <fieldset style={{ border: "none", padding: 0, minWidth: 0, width: "100%" }}>
    <legend
      className="mono"
      style={{
        width: "100%",
        color: "var(--text-muted)",
        borderBottom: "1px solid var(--rule)",
        paddingBottom: ".375rem",
        marginBottom: ".5rem",
      }}
    >
      Timbre / 音色
    </legend>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(8.5rem, 1fr))",
        gap: "1px",
        background: "var(--border)",
        border: "1px solid var(--border)",
      }}
    >
      {WAVE_TYPES.map((wave, i) => {
        const checked = value === wave.value
        return (
          <label
            key={wave.value}
            className="option"
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
              cursor: "pointer",
              padding: ".625rem .75rem",
              minHeight: "2.75rem",
              backgroundColor: checked ? "var(--text)" : "var(--paper)",
              color: checked ? "var(--paper)" : "var(--text)",
              fontSize: ".875rem",
            }}
          >
            <input
              type="radio"
              name="waveType"
              value={wave.value}
              checked={checked}
              onChange={() => onChange(wave.value)}
              className="visually-hidden"
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".625rem",
                color: checked ? "var(--accent)" : "var(--text-faint)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {wave.label}
          </label>
        )
      })}
    </div>
  </fieldset>
)
