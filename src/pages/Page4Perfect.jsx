import { useEffect, useRef, useState } from 'react'

const DODGE_RADIUS = 160

export default function Page4Perfect({ onAdvance }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const noBtnRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const lastCursorRef = useRef({ x: null, y: null })

  // spring: every frame, pull the button 3% closer to origin
  useEffect(() => {
    let raf
    const tick = () => {
      const { x, y } = offsetRef.current
      if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
        const nx = Math.abs(x) < 0.5 ? 0 : x * 0.97
        const ny = Math.abs(y) < 0.5 ? 0 : y * 0.97
        offsetRef.current = { x: nx, y: ny }
        setOffset({ x: nx, y: ny })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const runAway = (clientX, clientY) => {
    const btn = noBtnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = cx - clientX
    const dy = cy - clientY
    const dist = Math.hypot(dx, dy)

    if (dist > DODGE_RADIUS) {
      lastCursorRef.current = { x: null, y: null }
      return
    }

    const last = lastCursorRef.current
    let step = 12
    if (last.x !== null) {
      step = Math.max(Math.hypot(clientX - last.x, clientY - last.y) * 1.5, 12)
    }
    lastCursorRef.current = { x: clientX, y: clientY }

    const angle = Math.atan2(dy, dx)
    const maxX = window.innerWidth / 2 - 80
    const maxY = window.innerHeight / 2 - 80
    const nx = Math.max(-maxX, Math.min(maxX, offsetRef.current.x + Math.cos(angle) * step))
    const ny = Math.max(-maxY, Math.min(maxY, offsetRef.current.y + Math.sin(angle) * step))

    offsetRef.current = { x: nx, y: ny }
    setOffset({ x: nx, y: ny })
  }

  return (
    <section
      className="page"
      onPointerMove={(e) => runAway(e.clientX, e.clientY)}
    >
      <h1 className="page-title">I am so perfect, aren't I?</h1>
      <p className="page-sub">Just tell the truth</p>

      <div className="yesno-row">
        <button className="btn yes-btn" onClick={onAdvance}>
          YES
        </button>
        <button
          ref={noBtnRef}
          className="btn no-btn"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          onPointerDown={(e) => {
            e.preventDefault()
            runAway(e.clientX, e.clientY)
          }}
        >
          No
        </button>
      </div>
    </section>
  )
}
