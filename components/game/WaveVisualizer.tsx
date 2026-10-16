"use client"
import { FC, useRef, useEffect } from "react"
import { getAnalyser } from "lib/audio"

type Props = {
  isPlaying: boolean
}

export const WaveVisualizer: FC<Props> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const W = rect.width
    const H = rect.height
    const centerY = H / 2
    const css = getComputedStyle(canvas)
    const ink = css.getPropertyValue("--text").trim() || "#1b1a18"
    const accent = css.getPropertyValue("--accent").trim() || "#e8380d"
    const grid = css.getPropertyValue("--border").trim() || "#c4bdaf"

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      ctx.clearRect(0, 0, W, H)
      drawGrid(ctx, W, H, grid)

      const analyser = getAnalyser()

      if (!analyser) {
        drawFlatLine(ctx, W, centerY, ink)
        return
      }

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      const isSilent = dataArray.every((v) => v === 128)
      if (isSilent) {
        drawFlatLine(ctx, W, centerY, ink)
        return
      }

      ctx.lineWidth = 1.5
      ctx.strokeStyle = accent
      ctx.beginPath()

      const sliceWidth = W / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * H) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }

      ctx.lineTo(W, centerY)
      ctx.stroke()
    }

    draw()

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-label="音波ビジュアライザー"
      style={{
        width: "100%",
        height: "5rem",
        background: "var(--paper)",
        border: `1px solid ${isPlaying ? "var(--accent)" : "var(--rule)"}`,
        display: "block",
        transition: "border-color 0.3s",
      }}
    />
  )
}

// オシロスコープ風の目盛り
function drawGrid(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  color: string
) {
  ctx.lineWidth = 0.5
  ctx.strokeStyle = color
  ctx.beginPath()
  for (let x = 0; x <= W; x += W / 16) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
  }
  ctx.moveTo(0, H / 4)
  ctx.lineTo(W, H / 4)
  ctx.moveTo(0, (H * 3) / 4)
  ctx.lineTo(W, (H * 3) / 4)
  ctx.stroke()
}

function drawFlatLine(
  ctx: CanvasRenderingContext2D,
  W: number,
  centerY: number,
  color: string
) {
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.setLineDash([4, 8])
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(W, centerY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}
