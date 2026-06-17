# App Explanation — web-for-babe

This document explains how the app works from top to bottom, including the framework, the code grammar, and the flow of every page. No prior React knowledge is assumed.

---

## 1. What is React?

React is a JavaScript library that lets you build a website out of small, reusable building blocks called **components**. Each component is basically a JavaScript function that returns HTML-like code describing what should appear on screen.

The HTML-like syntax you see inside `.jsx` files is called **JSX**. It looks like this:

```jsx
<h1 className="page-title">hello</h1>
```

It is not real HTML — it gets converted to regular JavaScript before the browser sees it. The main difference from normal HTML is that you write `className` instead of `class` (because `class` is a reserved word in JavaScript).

---

## 2. What is a Component?

A component is a function that starts with a capital letter and returns JSX. Example:

```jsx
export default function Card({ emoji, text, onContinue }) {
  return (
    <div className="card">
      <div>{emoji}</div>
      <div>{text}</div>
      <button onClick={onContinue}>continue</button>
    </div>
  )
}
```

- `export default` means "this is the main thing this file provides, so other files can import it".
- The `{ emoji, text, onContinue }` inside the parentheses are called **props** — they are values passed in from whoever uses this component, like arguments to a function.
- Curly braces `{}` inside JSX mean "put a JavaScript value here". So `{emoji}` renders whatever string or emoji was passed in.

---

## 3. What is State?

State is memory that lives inside a component. When state changes, React automatically re-renders (redraws) that component on screen.

State is created with a special function called `useState`:

```jsx
import { useState } from 'react'

const [page, setPage] = useState(0)
```

This creates:
- `page` — the current value (starts at `0`)
- `setPage` — a function you call to change the value

Whenever `setPage(1)` is called, React updates `page` to `1` and redraws the component.

---

## 4. What is `useEffect`?

`useEffect` lets a component run code *after* it appears on screen, or whenever a specific value changes. It is used for things like timers and intervals.

```jsx
useEffect(() => {
  const interval = setInterval(doSomething, 750)
  return () => clearInterval(interval)   // cleanup when component is removed
}, [])  // the [] means "only run once, when the component first appears"
```

---

## 5. What is `useRef`?

`useRef` stores a value that does NOT cause a re-render when it changes. It is mostly used to get a direct handle on a real HTML element.

```jsx
const noBtnRef = useRef(null)
// later:
<button ref={noBtnRef}>no</button>
// now noBtnRef.current is the actual HTML button element
```

---

## 6. What is `useMemo`?

`useMemo` runs a calculation once and remembers the result, instead of recalculating every time the component redraws.

```jsx
const petals = useMemo(() => {
  return Array.from({ length: 26 }, () => ({ ... }))
}, [])  // [] means calculate once and never again
```

---

## 7. How the App is Structured

```
src/
  main.jsx              ← entry point, starts the whole app
  App.jsx               ← controls which page is showing
  index.css             ← all visual styling
  components/
    BubbleLayer.jsx     ← floating bubbles (always visible)
    Card.jsx            ← the pop-up "congrats" overlay
  pages/
    Page1WhoAreYou.jsx  ← puzzle 1: type your name
    Page2WhichOne.jsx   ← puzzle 2: pick the cats
    Page3Boyfriend.jsx  ← puzzle 3: name + describe boyfriend
    Page4Perfect.jsx    ← puzzle 4: the "no" button runs away
    Page5Ending.jsx     ← final page: the love note
```

### `main.jsx` — the Starting Point

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

This finds the `<div id="root">` in `index.html` and puts the entire app inside it. `<App />` is the very first component that runs. Everything else lives inside `App`.

---

## 8. `App.jsx` — The Navigator

```jsx
export default function App() {
  const [page, setPage] = useState(0)
  const next = () => setPage((p) => p + 1)

  const pages = [
    <Page1WhoAreYou key="p1" onAdvance={next} />,
    <Page2WhichOne  key="p2" onAdvance={next} />,
    <Page3Boyfriend key="p3" onAdvance={next} />,
    <Page4Perfect   key="p4" onAdvance={next} />,
    <Page5Ending    key="p5" />,
  ]

  return (
    <div className="app">
      <BubbleLayer />
      {pages[page]}
    </div>
  )
}
```

**How navigation works:**

- `page` starts at `0`.
- `pages` is an array of all 5 pages, pre-built and ready. Only one is shown at a time: `{pages[page]}`.
- Every page (except the last) receives `onAdvance={next}` as a prop. When a page calls `onAdvance()`, it triggers `next()`, which increments `page` by 1, and React re-renders showing the next page.
- `BubbleLayer` is placed here so it stays visible on all pages without being re-created.
- The `key` attribute (`key="p1"` etc.) helps React tell the pages apart in the array. It is a required hint whenever you render a list of things.

**Flow diagram:**

```
page=0 → Page1WhoAreYou → [solves puzzle] → calls onAdvance()
page=1 → Page2WhichOne  → [solves puzzle] → calls onAdvance()
page=2 → Page3Boyfriend → [solves puzzle] → calls onAdvance()
page=3 → Page4Perfect   → [clicks YES]    → calls onAdvance()
page=4 → Page5Ending    → (no advance, this is the end)
```

---

## 9. `BubbleLayer.jsx` — Floating Bubbles

This component is purely decorative. It runs in the background on every page.

**What it does:**
- Every 750ms, it creates a new bubble object with a random size, horizontal position, and floating duration.
- Each bubble floats upward using a CSS animation (`floatUp`).
- After its duration expires, the bubble is automatically removed from the list.
- Clicking a bubble removes it and spawns a floating heart emoji at the exact click position.

**Key code pattern:**

```jsx
const [bubbles, setBubbles] = useState([])

// Adding a bubble:
setBubbles((prev) => [...prev, newBubble])
// [...prev, newBubble] means "a new array that contains everything that was there before, plus the new bubble"

// Removing a bubble by id:
setBubbles((prev) => prev.filter((b) => b.id !== id))
// .filter() keeps only items where the condition is true (i.e., all bubbles except the one with this id)
```

The `fx-layer` div has `pointer-events: none` in CSS so you can click *through* it to the page below, except for the bubbles themselves which have `pointer-events: auto`.

**CSS variables** — the bubble uses `--drift` as a custom CSS variable to control how far sideways it drifts:

```jsx
style={{ '--drift': `${b.drift}px` }}
```

And in CSS:
```css
transform: translateY(-110vh) translateX(var(--drift, 0px));
```

---

## 10. `Card.jsx` — The Pop-up Overlay

```jsx
export default function Card({ emoji = '🐱', text, buttonText = 'continue', onContinue }) {
  return (
    <div className="card-overlay">
      <div className="card">
        <div className="card-emoji">{emoji}</div>
        <div className="card-text">{text}</div>
        <button className="btn" onClick={onContinue}>{buttonText}</button>
      </div>
    </div>
  )
}
```

- `emoji = '🐱'` — the `= '🐱'` part is a **default value**: if no emoji is passed in, it defaults to 🐱.
- `onClick={onContinue}` — when the button is clicked, it calls the `onContinue` function that was passed in as a prop.
- `.card-overlay` is a full-screen blurred backdrop. `.card` is the white pop-up box on top of it.
- This component is shown by pages when they detect the puzzle is solved.

---

## 11. Page 1 — `Page1WhoAreYou.jsx` (Type your name)

**Puzzle:** Type "stupid cute little kat" into the text input.

```jsx
const ANSWER = 'stupid cute little kat'
const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ')
```

`normalize` makes the comparison forgiving — it removes extra spaces and ignores capitalization. So "  Stupid Cute  Little Kat  " still counts as correct.

**Wrong answer messages:**
```jsx
const WRONG_MESSAGES = [
  'wrong answer! try again!',
  "let me give you a hint: ...",
  'awwww, the answer is still wrong ...',
  'alright, let me tell you the answer: "stupid cute little kat"',
]
```

The app tracks how many wrong attempts have been made (`attempts` state). Each wrong guess shows the next message in the array. `Math.min(attempts, WRONG_MESSAGES.length - 1)` makes sure it never goes past the last message.

**State in this page:**

| state variable | what it holds |
|---|---|
| `value` | what the user is currently typing |
| `attempts` | number of wrong guesses |
| `feedback` | the current error message to display |
| `solved` | `true`/`false` — whether the answer was correct |

When `solved` becomes `true`, `<Card>` appears with an `onContinue={onAdvance}` prop, so clicking the card's button advances to the next page.

```jsx
{solved && (
  <Card emoji="🎉" text="congrats, you passed!" onContinue={onAdvance} />
)}
```

`{solved && <Card ... />}` means: "only render the Card if `solved` is `true`". This is a common React pattern — it is short for `if (solved) { return <Card /> }`.

---

## 12. Page 2 — `Page2WhichOne.jsx` (Pick the cats)

**Puzzle:** The title says "which **one** **is** you" — but you must first click the words "one" and "is" to change them to "ones" and "are", which unlocks multi-select mode. Then you must select ALL 9 cats.

**The magic words:**
```jsx
const [oneChanged, setOneChanged] = useState(false)
const [isChanged,  setIsChanged]  = useState(false)

const multiSelect = oneChanged && isChanged
```

Each magic word is a `<span>` with an `onClick`. Clicking it flips its boolean to `true`. When both are `true`, `multiSelect` becomes `true`.

```jsx
<span
  className={`magic-word ${oneChanged ? 'used' : ''}`}
  onClick={() => setOneChanged(true)}
>
  {oneChanged ? 'ones' : 'one'}
</span>
```

- `` `magic-word ${oneChanged ? 'used' : ''}` `` is a **template literal** — backtick strings that can embed JavaScript with `${}`. This adds the `used` CSS class only when `oneChanged` is `true`.
- `{oneChanged ? 'ones' : 'one'}` is a **ternary expression**: "if `oneChanged` is true, show 'ones', else show 'one'".

**Cat selection:**
```jsx
const [selected, setSelected] = useState([])  // array of selected indices

const toggle = (idx) => {
  setSelected((prev) => {
    const isOn = prev.includes(idx)
    if (multiSelect) {
      return isOn ? prev.filter((i) => i !== idx) : [...prev, idx]
    }
    return isOn ? [] : [idx]  // singular mode: only one at a time
  })
}
```

- In singular mode (before magic words are clicked), tapping a cat deselects everything else.
- In multi-select mode, tapping toggles that cat on or off without affecting others.

The solve check:
```jsx
if (selected.length === CATS.length) {
  setSolved(true)
}
```

All 9 must be selected. On solve, `<Card>` appears as in Page 1.

---

## 13. Page 3 — `Page3Boyfriend.jsx` (Name + describe him)

**Puzzle:** Has two sub-steps, controlled by `step` state.

```jsx
const [step, setStep] = useState('name')  // 'name' | 'words'
```

**Step 1 — name:** Type "ino" into the input. On correct answer, `setStep('words')` switches to step 2 without advancing to the next page.

```jsx
if (step === 'name') {
  return ( ... name input form ... )
}
return ( ... word grid ... )
```

This is a conditional render: the component returns completely different JSX depending on which step you are in.

**Step 2 — words:** A grid of 18 words, each either `good: true` or `good: false`. You must pick every good word and leave every bad word unpicked.

```jsx
const checkWords = () => {
  const allGoodPicked = WORDS.every((w, i) => (w.good ? picked.includes(i) : true))
  const noBadPicked   = WORDS.every((w, i) => (!w.good ? !picked.includes(i) : true))

  if (allGoodPicked && noBadPicked) {
    onAdvance()   // ← goes directly to next page, no Card in between
  } else if (!noBadPicked) {
    setWordMsg('hey! that word does NOT suit him ...')
  } else {
    setWordMsg('aww, you missed some! ...')
  }
}
```

- `.every()` returns `true` only if the condition is `true` for every item in the array.
- Notice: this page calls `onAdvance()` directly instead of showing a `Card` first — the page jump itself is the reward.

---

## 14. Page 4 — `Page4Perfect.jsx` (The "no" button runs away)

**Puzzle:** Click YES. You literally cannot click NO because the button dodges your cursor.

```jsx
const [offset, setOffset] = useState({ x: 0, y: 0 })
const noBtnRef = useRef(null)
```

- `offset` stores how far the NO button has been pushed from its original position (in pixels).
- `noBtnRef` holds a direct reference to the NO button's HTML element, so we can read its position.

**The dodge logic:**
```jsx
const runAway = (clientX, clientY) => {
  const btn = noBtnRef.current
  const r = btn.getBoundingClientRect()   // get button's position on screen
  const cx = r.left + r.width / 2        // button center X
  const cy = r.top + r.height / 2        // button center Y
  const dx = cx - clientX                // vector from cursor to button center
  const dy = cy - clientY
  const dist = Math.hypot(dx, dy)        // distance between cursor and button
  if (dist > DODGE_RADIUS) return        // too far away, don't react

  // push in the opposite direction from the cursor, with a bit of randomness
  const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2
  const jump = 180 + Math.random() * 80
  let nx = offset.x + Math.cos(angle) * jump
  let ny = offset.y + Math.sin(angle) * jump

  // clamp so it doesn't fly off screen
  nx = Math.max(-maxX, Math.min(maxX, nx))
  ny = Math.max(-maxY, Math.min(maxY, ny))

  setOffset({ x: nx, y: ny })
}
```

`onPointerMove` on the whole page calls `runAway` every time the mouse/finger moves, so the button reacts even before you reach it. The NO button also has `onPointerDown` (finger-press on touch screens) that calls `runAway`, so it also dodges on tap.

The button's visual position is updated via inline style:
```jsx
style={{
  transform: `translate(${offset.x}px, ${offset.y}px)`,
  transition: fleeing
    ? 'transform 0.12s ease-out'    // fast when dodging
    : 'transform 0.9s ease-in-out'  // slow drift back
}}
```

`useEffect` watches `offset` and after 900ms of no new dodges, resets it back to `{x:0, y:0}` so the button drifts back to its original spot.

Clicking YES calls `onAdvance()` directly, advancing to the final page.

---

## 15. Page 5 — `Page5Ending.jsx` (The love note)

This page has no puzzle — it is the final destination. It is the only page that receives no `onAdvance` prop.

**What it shows:**
- Falling flowers and hearts raining down the screen.
- Three cat GIFs walking across the screen repeatedly.
- A big animated title: "Yeah! Babe I love you <3"
- A photo of you two together.
- A love note at the bottom.

**`useMemo` for the decorations:**
```jsx
const petals = useMemo(
  () => Array.from({ length: 26 }, (_, i) => ({
    id: i,
    emoji: ...,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 6,
    size: 18 + Math.random() * 26,
  })),
  [],
)
```

`Array.from({ length: 26 }, (_, i) => ...)` creates an array of 26 objects, one per petal. The random values are calculated once and stored, so the petals don't jump around on every re-render. Each petal's random `delay` and `duration` are applied as inline CSS styles, so they all fall at different times and speeds.

The cats alternate directions:
```jsx
dir: i % 2 === 0 ? 'catAcross' : 'catAcrossRev'
```
- `i % 2 === 0` means "if the index is even". Even-index cats walk left-to-right; odd-index cats walk right-to-left (using `scaleX(-1)` in CSS to flip the image).

**HTML entity note:**
```jsx
<h1>Yeah! Babe I love you &lt;3</h1>
<p>forever &amp; always ...</p>
```
In JSX, `&lt;` renders as `<` and `&amp;` renders as `&`. These are HTML escape codes used to display characters that would otherwise be misread as HTML syntax.

---

## 16. How CSS Styling Works

All styles are in a single file: `src/index.css`. Components reference styles by `className`:

```jsx
<section className="page">
```

```css
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

**CSS custom properties (variables)** are defined at the top of the file:
```css
:root {
  --pink-deep: #e84393;
  --shadow: 0 10px 30px rgba(232, 67, 147, 0.18);
}
```

And used anywhere with `var(--pink-deep)`. This means the entire color palette can be changed from one place.

**CSS animations** are used heavily for the visual feel:
```css
@keyframes pageIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: none; }
}
.page {
  animation: pageIn 0.6s ease both;
}
```

Every time a new page appears, it fades in and slides up slightly. The `both` fill mode means the animation starts from its `from` state immediately (no flash of the final state before it begins).

---

## 17. Complete User Flow

```
Open the app
  │
  ▼
[Page 1] "who are you?"
  Type "stupid cute little kat" → 🎉 Card appears → click continue
  │
  ▼
[Page 2] "which one is you"
  Click "one" → changes to "ones"
  Click "is"  → changes to "are"
  Select ALL 9 cat images → click "this is me!" → 🥰 Card appears → click continue
  │
  ▼
[Page 3] "who is your handsome boyfriend?"
  Type "ino" → sub-step changes to word grid
  Pick all good words, leave bad words unpicked → click "these all suit him!" → jumps directly to next page
  │
  ▼
[Page 4] "he is so perfect, isn't he?"
  Try to click "no" → it runs away
  Click "YES" → advances
  │
  ▼
[Page 5] Ending
  Flowers and hearts rain down
  Cats walk across the screen
  Title pulses: "Yeah! Babe I love you <3"
  Your photo appears
  Love note at the bottom
  (no further navigation — this is the end)
```
