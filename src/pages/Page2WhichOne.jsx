import { useState } from 'react'
import Card from '../components/Card.jsx'

const CATS = [
  'angry-gif.gif',
  'dance-gif.gif',
  'eat-gif.gif',
  'evil-gif.gif',
  'kill.png',
  'lick-gif.gif',
  'mi-u.png',
  'mimi-gif.gif',
  'stupid-gif.gif',
]

export default function Page2WhichOne({ onAdvance }) {
  const [oneChanged, setOneChanged] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [selected, setSelected] = useState([]) // array of indices
  const [nudge, setNudge] = useState('')
  const [solved, setSolved] = useState(false)

  const multiSelect = oneChanged && isChanged

  const toggle = (idx) => {
    setNudge('')
    setSelected((prev) => {
      const isOn = prev.includes(idx)
      if (multiSelect) {
        return isOn ? prev.filter((i) => i !== idx) : [...prev, idx]
      }
      // singular mode: only one picture at a time
      return isOn ? [] : [idx]
    })
  }

  const check = () => {
    if (selected.length === CATS.length) {
      setSolved(true)
    } else if (!multiSelect) {
      setNudge("hmm… are you sure that's the only one? 👀 (psst, look at the title)")
    } else {
      setNudge('not quite! pick ALL of them, every single stupid cat 🐱')
    }
  }

  return (
    <section className="page">
      <h1 className="page-title">
        which{' '}
        <span
          className={`magic-word ${oneChanged ? 'used' : ''}`}
          onClick={() => setOneChanged(true)}
        >
          {oneChanged ? 'ones' : 'one'}
        </span>{' '}
        <span
          className={`magic-word ${isChanged ? 'used' : ''}`}
          onClick={() => setIsChanged(true)}
        >
          {isChanged ? 'are' : 'is'}
        </span>{' '}
        you
      </h1>
      <p className="page-sub">
        {multiSelect
          ? 'now pick every cat that is you 🐾'
          : 'pick the one that is you 🐾'}
      </p>

      <div className="cat-grid">
        {CATS.map((file, idx) => {
          const on = selected.includes(idx)
          return (
            <div key={file} className={`cat-card ${on ? 'selected' : ''}`}>
              <div className="cat-img-wrap">
                <img src={`/materials/stupid-cats/${file}`} alt="a stupid cat" />
                {on && <span className="cat-badge">💖</span>}
              </div>
              <button
                className={`check-btn ${on ? 'on' : ''}`}
                onClick={() => toggle(idx)}
              >
                {on ? '✓ selected' : 'select'}
              </button>
            </div>
          )
        })}
      </div>

      {nudge && <p className="feedback">{nudge}</p>}

      <button className="btn" onClick={check}>
        this is me! 💗
      </button>

      {solved && (
        <Card
          emoji="🥰"
          text="congrats again, my little kitty"
          onContinue={onAdvance}
        />
      )}
    </section>
  )
}
