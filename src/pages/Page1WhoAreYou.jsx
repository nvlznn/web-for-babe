import { useState } from 'react'
import Card from '../components/Card.jsx'

const ANSWER = 'stupid cute little kat'

const WRONG_MESSAGES = [
  'wrong answer! try again!',
  "let me give you a hint: the answer contains 'stupid', 'little', 'cute'",
  'awwww, the answer is still wrong, you stupid little kat <3',
  'alright, let me tell you the answer: "stupid cute little kat"',
]

const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ')

export default function Page1WhoAreYou({ onAdvance }) {
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [solved, setSolved] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (normalize(value) === ANSWER) {
      setSolved(true)
      return
    }
    // pick the message for this attempt, clamp to the last one
    const idx = Math.min(attempts, WRONG_MESSAGES.length - 1)
    setFeedback(WRONG_MESSAGES[idx])
    setAttempts((a) => a + 1)
  }

  return (
    <section className="page">
      <h1 className="page-title">who are you? 🐱</h1>
      <form className="input-row" onSubmit={submit}>
        <input
          className="cute-input"
          type="text"
          value={value}
          autoFocus
          placeholder="type your answer here..."
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn" type="submit">
          submit 💗
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}

      {solved && (
        <Card
          emoji="🎉"
          text="congrats, you passed! welcome to the next page!"
          onContinue={onAdvance}
        />
      )}
    </section>
  )
}
