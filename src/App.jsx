import { useState } from 'react'
import BubbleLayer from './components/BubbleLayer.jsx'
import Page1WhoAreYou from './pages/Page1WhoAreYou.jsx'
import Page2WhichOne from './pages/Page2WhichOne.jsx'
import Page3Boyfriend from './pages/Page3Boyfriend.jsx'
import Page4Perfect from './pages/Page4Perfect.jsx'
import Page5Ending from './pages/Page5Ending.jsx'

export default function App() {
  const [page, setPage] = useState(0)
  const next = () => setPage((p) => p + 1)

  const pages = [
    <Page1WhoAreYou key="p1" onAdvance={next} />,
    <Page2WhichOne key="p2" onAdvance={next} />,
    <Page3Boyfriend key="p3" onAdvance={next} />,
    <Page4Perfect key="p4" onAdvance={next} />,
    <Page5Ending key="p5" />,
  ]

  return (
    <div className="app">
      <BubbleLayer />
      {pages[page]}
    </div>
  )
}
