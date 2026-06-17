# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal, single-page React app: a romantic interactive "for my babe" experience built around stupid-cat photos. The user moves through a fixed linear sequence of mini "puzzle" pages, each gated by a playful solve condition, with a decorative floating-bubble layer over everything.

## Commands

- `npm run dev` — start the Vite dev server (hot reload)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/` locally

There is no test, lint, or typecheck setup (plain JSX, no TypeScript, no ESLint config).

## Architecture

- **`src/App.jsx` drives navigation.** It holds a single `page` index in state and renders one page at a time from a `pages` array. Progression is one-directional: every page except the last receives an `onAdvance` callback that increments the index. There is no router and no back navigation.
- **Each `src/pages/PageN*.jsx` is a self-contained puzzle.** A page manages its own local state, decides when it's "solved," and on solve renders the shared `Card` overlay whose `onContinue` fires `onAdvance` to move forward. To add/reorder/remove a step, edit the `pages` array in `App.jsx` and follow the existing page contract (`{ onAdvance }` prop; render `Card` on solve). The final page (`Page5Ending`) intentionally has no `onAdvance`.
- **`src/components/Card.jsx`** is the reusable centered "congrats" pop-up shown between pages.
- **`src/components/BubbleLayer.jsx`** is a global decorative effect mounted once in `App`, independent of page state: it spawns floating bubbles on an interval and turns clicks into floating hearts.
- **All styling lives in a single `src/index.css`** (class-based, e.g. `.page`, `.card`, `.magic-word`, `.cat-grid`). Pages reference these classes directly — there are no CSS modules or styled-components.

## Assets

- Images are served from **`public/materials/`** and referenced with root-absolute paths like `/materials/stupid-cats/<file>` (Vite serves `public/` at the web root — do **not** import them as modules).
- A top-level **`materials/`** folder mirrors the same files as originals/source. When adding or changing imagery, keep `public/materials/` in sync, since that copy is the one actually served.
