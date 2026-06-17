import { useEffect, useRef, useState } from 'react'

let idCounter = 0

// Continuously spawns floating pink bubbles. Clicking a bubble pops it and
// leaves a floating heart behind.
export default function BubbleLayer() {
  const [bubbles, setBubbles] = useState([])
  const [hearts, setHearts] = useState([])
  const layerRef = useRef(null)

  // spawn a new bubble on an interval
  useEffect(() => {
    const spawn = () => {
      const size = 26 + Math.random() * 48
      const id = ++idCounter
      const bubble = {
        id,
        size,
        left: Math.random() * 100, // vw %
        duration: 7 + Math.random() * 7,
        drift: (Math.random() - 0.5) * 160,
      }
      setBubbles((prev) => [...prev, bubble])
      // auto-remove after it floats off screen
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id))
      }, bubble.duration * 1000)
    }

    const interval = setInterval(spawn, 750)
    // seed a few immediately so the screen isn't empty
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 250)
    return () => clearInterval(interval)
  }, [])

  const popBubble = (bubble, e) => {
    const rect = layerRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left ?? 0)
    const y = e.clientY - (rect?.top ?? 0)
    const heartId = ++idCounter
    const emojis = ['💗', '💕', '💓', '💖', '🩷']
    setHearts((prev) => [
      ...prev,
      { id: heartId, x, y, emoji: emojis[Math.floor(Math.random() * emojis.length)] },
    ])
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heartId))
    }, 1600)
    // remove the popped bubble
    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
  }

  return (
    <div className="fx-layer" ref={layerRef}>
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          onClick={(e) => popBubble(b, e)}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}vw`,
            '--drift': `${b.drift}px`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
