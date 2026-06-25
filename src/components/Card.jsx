// A centered pop-up "congrats" card used between pages.
export default function Card({ emoji = '🐱', text, buttonText = 'continue', onContinue }) {
  return (
    <div className="card-overlay">
      <div className="card">
        <div className="card-emoji">{emoji}</div>
        <div className="card-text">{text}</div>
        <button className="btn" onClick={onContinue} autoFocus>
          {buttonText}
        </button>
      </div>
    </div>
  )
}
