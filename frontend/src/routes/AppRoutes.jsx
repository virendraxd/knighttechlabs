import { Routes, Route } from 'react-router-dom'

import Home from '../Home'
import About from '../pages/About'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import Unicover from '../products/unicover/Unicover'

function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="products/unicover"
        element={<Unicover />}
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