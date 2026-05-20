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
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener)
  }, [])

  if (!prompt) return null

  return (
    <button
      onClick={async () => {
        await prompt.prompt()
        setPrompt(null)
      }}
      style={{
        marginTop: ".5rem",
        padding: ".4rem .9rem",
        background: "#555",
        color: "#fff",
        border: "1px solid #777",
        borderRadius: ".4rem",
        fontSize: ".75rem",
        cursor: "pointer",
      }}
    >
      アプリをインストール
    </button>
  )
}
