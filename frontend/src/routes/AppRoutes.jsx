import { Routes, Route } from 'react-router-dom'

import Home from '../Home'
import About from '../pages/About'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import { lazy, Suspense } from 'react'

const Unicover = lazy(() => import('../products/unicover/Unicover'))
const BulkBgRemover = lazy(() => import('../products/bulk_bg_remover/BulkBgRemover'))

function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="products/unicover"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Unicover />
          </Suspense>
        }
      />

      <Route
        path="products/bulk_bg_remover"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <BulkBgRemover />
          </Suspense>
        }
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/privacy"
        element={<Privacy />}
      />

      <Route
        path="/terms"
        element={<Terms />}
      />

    </Routes>

  )
}

export default AppRoutes