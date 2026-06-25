import { useMemo } from 'react'

const FLOWERS = ['🌸', '🌷', '🌺', '💐', '🌹', '🏵️']
const HEARTS = ['💗', '💕', '💖', '💓', '🩷', '❤️']
const MOVING_CATS = ['dance-gif.gif', 'mimi-gif.gif', 'lick-gif.gif']

export default function Page5Ending() {
  // pre-compute random decorations once
  const petals = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const pool = i % 2 === 0 ? FLOWERS : HEARTS
        return {
          id: i,
          emoji: pool[Math.floor(Math.random() * pool.length)],
          left: Math.random() * 100,
          delay: Math.random() * 6,
          duration: 6 + Math.random() * 6,
          size: 18 + Math.random() * 26,
        }
      }),
    [],
  )

  const cats = useMemo(
    () =>
      MOVING_CATS.map((file, i) => ({
        file,
        top: 12 + Math.random() * 70,
        delay: i * 1.5,
        duration: 9 + Math.random() * 5,
        dir: i % 2 === 0 ? 'catAcross' : 'catAcrossRev',
      })),
    [],
  )

  return (
    <section className="page ending">
      {/* falling flowers & hearts */}
      <div className="petal-layer">
        {petals.map((p) => (
          <span
            key={p.id}
            className="petal"
            style={{
              left: `${p.left}vw`,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* cats walking across the screen */}
      <div className="cat-walk-layer">
        {cats.map((c, i) => (
          <img
            key={i}
            className="walking-cat"
            src={`/materials/stupid-cats/${c.file}`}
            alt="a happy cat"
            style={{
              top: `${c.top}vh`,
              animationName: c.dir,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <h1 className="page-title ending-title">Yeah! Babe I love you &lt;3</h1>

      <div className="us-frame">
        <img src="/materials/us.JPG" alt="us together 💗" />
      </div>

      <p className="page-sub">Forever &amp; always, your stupid cute little kat &amp; her Ino 🐱💍</p>
    </section>
  )
}
