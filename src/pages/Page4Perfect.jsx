import { useEffect, useRef, useState } from 'react'

const DODGE_RADIUS = 130

export default function Page4Perfect({ onAdvance }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [fleeing, setFleeing] = useState(false)
  const noBtnRef = useRef(null)
  const returnTimer = useRef(null)

  // after a dodge, slowly drift back to the original spot
  useEffect(() => {
    if (offset.x === 0 && offset.y === 0) return
    clearTimeout(returnTimer.current)
    returnTimer.current = setTimeout(() => {
      setFleeing(false)
      setOffset({ x: 0, y: 0 })
    }, 900)
    return () => clearTimeout(returnTimer.current)
  }, [offset])

  const runAway = (clientX, clientY) => {
    const btn = noBtnRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = cx - clientX
    const dy = cy - clientY
    const dist = Math.hypot(dx, dy)
    if (dist > DODGE_RADIUS) return

    // push away from the cursor, with a little randomness
    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2
    const jump = 180 + Math.random() * 80
    let nx = offset.x + Math.cos(angle) * jump
    let ny = offset.y + Math.sin(angle) * jump

    // keep it on screen-ish
    const maxX = window.innerWidth / 2 - 80
    const maxY = window.innerHeight / 2 - 80
    nx = Math.max(-maxX, Math.min(maxX, nx))
    ny = Math.max(-maxY, Math.min(maxY, ny))

    setFleeing(true)
    setOffset({ x: nx, y: ny })
  }

  return (
    <section
      className="page"
      onPointerMove={(e) => runAway(e.clientX, e.clientY)}
    >
      <h1 className="page-title">he is so perfect, isn't he? 😏</h1>
      <p className="page-sub">tell the truth, little kitty 🐱</p>

      <div className="yesno-row">
        <button className="btn yes-btn" onClick={onAdvance}>
          YES 💗
        </button>
        <button
          ref={noBtnRef}
          className="btn no-btn"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: fleeing
              ? 'transform 0.12s ease-out'
              : 'transform 0.9s ease-in-out',
          }}
          // never actually triggers — it dodges on press too (for touch)
          onPointerDown={(e) => {
            e.preventDefault()
            runAway(e.clientX, e.clientY)
          }}
        >
          no
        </button>
      </div>
    </section>
  )
}
