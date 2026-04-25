"use client"
import { FC } from "react"
import type { OscillatorWaveType } from "types/game"

const WAVE_TYPES: { value: OscillatorWaveType; label: string }[] = [
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
  <div>
    <p style={{ fontSize: ".875rem", marginBottom: ".5rem", color: "#aaa" }}>音色</p>
    <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
      {WAVE_TYPES.map((wave) => (
        <label
          key={wave.value}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: ".375rem .75rem",
            borderRadius: ".375rem",
            border: `1px solid ${value === wave.value ? "#7c6bf0" : "#555"}`,
            backgroundColor: value === wave.value ? "#2d2460" : "transparent",
            fontSize: ".875rem",
          }}
        >
          <input
            type="radio"
            name="waveType"
            value={wave.value}
            checked={value === wave.value}
            onChange={() => onChange(wave.value)}
            style={{ display: "none" }}
          />
          {wave.label}
        </label>
      ))}
    </div>
  </div>
)
