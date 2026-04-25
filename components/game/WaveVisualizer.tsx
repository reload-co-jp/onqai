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

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = "#111827"
      ctx.fillRect(0, 0, W, H)

      const analyser = getAnalyser()

      if (!analyser) {
        drawFlatLine(ctx, W, H, centerY, 0.25)
        return
      }

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)

      const isSilent = dataArray.every((v) => v === 128)
      if (isSilent) {
        drawFlatLine(ctx, W, H, centerY, 0.25)
        return
      }

      ctx.lineWidth = 2
      ctx.strokeStyle = "#7c6bf0"
      ctx.shadowBlur = 12
      ctx.shadowColor = "#7c6bf0"
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
      ctx.shadowBlur = 0
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
        height: "80px",
        borderRadius: ".5rem",
        border: `1px solid ${isPlaying ? "#7c6bf0" : "#333"}`,
        display: "block",
        transition: "border-color 0.3s",
      }}
    />
  )
}

function drawFlatLine(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  centerY: number,
  opacity: number
) {
  ctx.globalAlpha = opacity
  ctx.lineWidth = 1
  ctx.strokeStyle = "#7c6bf0"
  ctx.setLineDash([4, 8])
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(W, centerY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}
