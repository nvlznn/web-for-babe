import { useEffect, useRef, useState } from 'react'

const NAME = 'ino'

// good = adjectives that suit him (must all be picked)
// bad = words that do NOT suit him (must be left unpicked)
const WORDS = [
  { text: 'handsome', good: true },
  { text: 'stinky', good: false },
  { text: 'smart', good: true },
  { text: 'stupid', good: false },
  { text: 'kind', good: true },
  { text: 'smelly', good: false },
  { text: 'funny', good: true },
  { text: 'lazy', good: false },
  { text: 'charming', good: true },
  { text: 'annoying', good: false },
  { text: 'caring', good: true },
  { text: 'strong', good: true },
  { text: 'boring', good: false },
  { text: 'sweet', good: true },
  { text: 'mean', good: false },
  { text: 'cute', good: true },
  { text: 'romantic', good: true },
]

export default function Page3Boyfriend({ onAdvance }) {
  const [step, setStep] = useState('name') // 'name' | 'words'
  const [name, setName] = useState('')
  const [nameMsg, setNameMsg] = useState('')
  const [picked, setPicked] = useState([]) // indices
  const [wordMsg, setWordMsg] = useState('')

  const submitName = (e) => {
    e.preventDefault()
    if (name.trim().toLowerCase() === NAME) {
      setStep('words')
    } else {
      setNameMsg("That's not me. Try again, you should know my name (even if you are dumb)")
    }
  }

  const togglePick = (idx) => {
    setWordMsg('')
    setPicked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    )
  }

  const checkWords = () => {
    const allGoodPicked = WORDS.every((w, i) => (w.good ? picked.includes(i) : true))
    const noBadPicked = WORDS.every((w, i) => (!w.good ? !picked.includes(i) : true))

    if (allGoodPicked && noBadPicked) {
      onAdvance()
    } else if (!noBadPicked) {
      setWordMsg('There are WRONG words picked, you dumb cat, unpick them')
    } else {
      setWordMsg('Not even close, you dumb cat, pick more')
    }
  }

  const checkWordsRef = useRef(null)
  checkWordsRef.current = checkWords
  useEffect(() => {
    if (step !== 'words') return
    const onKey = (e) => { if (e.key === 'Enter') checkWordsRef.current() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  if (step === 'name') {
    return (
      <section className="page">
        <h1 className="page-title">Who is your handsome boyfriend?</h1>
        <p className="page-sub">Enter my name (three letters)</p>
        <form className="input-row" onSubmit={submitName}>
          <input
            className="cute-input"
            type="text"
            value={name}
            autoFocus
            placeholder="his name..."
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn" type="submit">
            That's him
          </button>
        </form>
        {nameMsg && <p className="feedback">{nameMsg}</p>}
      </section>
    )
  }

  return (
    <section className="page">
      <h1 className="page-title">Find all words that suit me</h1>
      <p className="page-sub">
        Pick every word that suits me
      </p>

      <div className="word-grid">
        {WORDS.map((w, idx) => {
          const on = picked.includes(idx)
          return (
            <button
              key={w.text}
              className={`word-chip ${on ? 'on' : ''}`}
              onClick={() => togglePick(idx)}
            >
              {w.text}
            </button>
          )
        })}
      </div>

      {wordMsg && <p className="feedback">{wordMsg}</p>}

      <button className="btn" onClick={checkWords}>
        These all suit him!
      </button>
    </section>
  )
}
