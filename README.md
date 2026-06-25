# web-for-babe

A personal, single-page interactive experience built as a romantic gift. The user moves through a series of playful puzzle pages, each unlocked by a small solve condition, with floating bubbles and hearts throughout.

## Stack

- [React 18](https://react.dev/) — UI
- [Vite 5](https://vitejs.dev/) — dev server and bundler
- Plain JSX, single CSS file — no TypeScript, no CSS modules, no component library

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

## Project structure

```
src/
  App.jsx              # Root — holds page index, renders one page at a time
  index.css            # All styles (single file, class-based)
  pages/
    Page1WhoAreYou.jsx # Puzzle 1: type the secret phrase
    Page2WhichOne.jsx  # Puzzle 2: unlock magic words, select all cats
    Page3Boyfriend.jsx # Puzzle 3: name the boyfriend, pick the right words
    Page4Perfect.jsx   # Puzzle 4: click YES (NO button dodges the cursor)
    Page5Ending.jsx    # Final page: ending screen, no advance
  components/
    Card.jsx           # Reusable "congrats" overlay shown between pages
    BubbleLayer.jsx    # Global floating bubbles + click-to-heart effect
public/
  materials/           # Images served at the web root (referenced as /materials/...)
materials/             # Source copy of the same images
```

## Adding a page

1. Create `src/pages/PageNYourName.jsx`. Accept `{ onAdvance }` as a prop. Call `onAdvance()` (or render `<Card onContinue={onAdvance} />`) when the puzzle is solved.
2. Add the component to the `pages` array in `src/App.jsx`, before `Page5Ending`.

## Assets

Images live in `public/materials/` and are referenced with root-absolute paths:

```jsx
<img src="/materials/stupid-cats/cat1.jpg" />
```

Keep `materials/` (the top-level folder) in sync as a source mirror.
