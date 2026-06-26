import { useEffect, useRef, useState } from 'react'

const DODGE_RADIUS = 160

export default function Page4Perfect({ onAdvance }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const noBtnRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: null, y: null })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter') onAdvance() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAdvance])

  useEffect(() => {
    let raf
    const tick = () => {
      const { x, y } = offsetRef.current
      const cursor = cursorRef.current
      const btn = noBtnRef.current

      let nx = x
      let ny = y

      if (cursor.x !== null && btn) {
        const r = btn.getBoundingClientRect()
        const bx = r.left + r.width / 2
        const by = r.top + r.height / 2
        const dx = bx - cursor.x
        const dy = by - cursor.y
        const dist = Math.hypot(dx, dy)

        if (dist < DODGE_RADIUS) {
          // too close — push away regardless of whether cursor is moving
          const angle = Math.atan2(dy, dx)
          const push = Math.max((DODGE_RADIUS - dist) * 0.22, 6)
          nx = x + Math.cos(angle) * push
          ny = y + Math.sin(angle) * push
        } else {
          // safe — spring toward origin
          nx = Math.abs(x) < 0.5 ? 0 : x * 0.97
          ny = Math.abs(y) < 0.5 ? 0 : y * 0.97
        }
      } else {
        nx = Math.abs(x) < 0.5 ? 0 : x * 0.97
        ny = Math.abs(y) < 0.5 ? 0 : y * 0.97
      }

      const maxX = window.innerWidth / 2 - 80
      const maxY = window.innerHeight / 2 - 80
      nx = Math.max(-maxX, Math.min(maxX, nx))
      ny = Math.max(-maxY, Math.min(maxY, ny))

      if (Math.abs(nx - x) > 0.1 || Math.abs(ny - y) > 0.1) {
        offsetRef.current = { x: nx, y: ny }
        setOffset({ x: nx, y: ny })
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const trackCursor = (clientX, clientY) => {
    cursorRef.current = { x: clientX, y: clientY }
  }

  return (
    <section
      className="page"
      onPointerMove={(e) => trackCursor(e.clientX, e.clientY)}
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
            trackCursor(e.clientX, e.clientY)
          }}
        >
          No
        </button>
      </div>
    </section>
  )
}
