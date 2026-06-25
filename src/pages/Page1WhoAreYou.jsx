import { useState } from 'react'
import Card from '../components/Card.jsx'

const ANSWER = 'dumb little kat'

const WRONG_MESSAGES = [
  'Not what I want! Try again!',
  "Let me give you a hint: 你是一個笨蛋小貓",
  'You stupid, the answer is still wrong, you ARE a dumb little kat! Try again',
  'I think it\'s too hard for you, the answer is "dumb little kat" :)',
]

// .trim() removes whitespace from both ends of a string
// .toLowerCase() converts the string to lowercase
// .replace(/\s+/g, ' ') replaces multiple whitespace characters with a single space
// \s: matches any whitespace character (spaces, tabs, line breaks)
// /g: global flag, meaning it will replace all occurrences in the 
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
      <h1 className="page-title">Who are you? 🐱</h1>
      <form className="input-row" onSubmit={submit}>
        <input
          className="cute-input"
          type="text"
          value={value}
          autoFocus
          placeholder="Type your answer here..."
          // `.target` will give you the element that triggered the event
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn" type="submit">
          Submit 💗
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}

      {solved && (
        <Card
          emoji="🎉"
          text="Congrats, you passed! Welcome to the next page!"
          onContinue={onAdvance}
        />
      )}
    </section>
  )
}
