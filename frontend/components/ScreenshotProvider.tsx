"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface ScreenshotContextType {
  isScreenshotMode: boolean
  toggleScreenshotMode: () => void
}

const ScreenshotContext = createContext<ScreenshotContextType | undefined>(undefined)

export function ScreenshotProvider({ children }: { children: React.ReactNode }) {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("apex_screenshot_mode")
    if (saved === "true") {
      setIsScreenshotMode(true)
    }
  }, [])

  const toggleScreenshotMode = () => {
    setIsScreenshotMode(prev => {
      const next = !prev
      localStorage.setItem("apex_screenshot_mode", String(next))
      return next
    })
  }

  return (
    <ScreenshotContext.Provider value={{ isScreenshotMode, toggleScreenshotMode }}>
      <div className={isScreenshotMode ? "screenshot-mode-active" : ""}>
        {children}
      </div>
    </ScreenshotContext.Provider>
  )
}

export function useScreenshotMode() {
  const context = useContext(ScreenshotContext)
  if (context === undefined) {
    console.warn("useScreenshotMode must be used within a ScreenshotProvider")
    return { isScreenshotMode: false, toggleScreenshotMode: () => {} }
  }
  return context
}
