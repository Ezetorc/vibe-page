import { Routes, HashRouter as Router, Route } from 'react-router'
import { Nav } from './components/Nav'
import { lazy, Suspense } from 'react'

const LazyHome = lazy(() => import('./pages/Home/components/Home.tsx'))

export default function App () {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route path='/' element={<LazyHome />} />
          </Routes>
          <Nav />
        </Router>
      </Suspense>
    </>
  )
}
