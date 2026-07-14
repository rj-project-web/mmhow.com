'use client'

import { useEffect, useRef } from 'react'

/**
 * Slim emerald reading-progress bar pinned to the top of the viewport.
 * Width tracks scroll position through the article. Hidden until the user
 * scrolls (stays at 0% at the very top, 100% at the very bottom).
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const update = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const max = doc.scrollHeight - doc.clientHeight
      const ratio = max > 0 ? scrollTop / max : 0
      bar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      aria-hidden
      ref={barRef}
      className="fixed left-0 top-0 z-[100] h-1 bg-emerald-500 transition-[width] duration-100 ease-out"
      style={{ width: '0%' }}
    />
  )
}
