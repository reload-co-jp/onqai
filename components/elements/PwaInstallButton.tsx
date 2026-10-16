"use client"

import { useEffect, useState } from "react"

export const PwaInstallButton = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler as EventListener)
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      )
  }, [])

  if (!prompt) return null

  return (
    <button
      onClick={async () => {
        await prompt.prompt()
        setPrompt(null)
      }}
      style={{
        alignSelf: "flex-start",
        padding: ".4rem .9rem",
        background: "transparent",
        color: "var(--text)",
        border: "1px solid var(--rule)",
        borderRadius: 0,
        fontSize: ".75rem",
        cursor: "pointer",
      }}
    >
      アプリをインストール
    </button>
  )
}
