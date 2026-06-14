"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const label = !mounted
    ? "Auto"
    : theme === "dark"
      ? "Dark"
      : theme === "light"
        ? "Light"
        : "Auto"

  const next = () => {
    const current = !mounted ? "system" : theme
    if (current === "system") setTheme("dark")
    else if (current === "dark") setTheme("light")
    else setTheme("system")
  }

  return (
    <span className="inline-flex items-center gap-2 text-[12px]">
      <span className="text-muted">Theme</span>
      <button
        type="button"
        onClick={next}
        className="border border-line px-[10px] py-[6px] text-ink hover:text-accent hover:border-accent transition-colors"
        aria-label={`Toggle theme (current: ${label})`}
      >
        {label}
      </button>
    </span>
  )
}
