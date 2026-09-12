import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { useApp } from './context/AppContext.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import RoleSelection from './pages/RoleSelection.jsx'
import Profile from './pages/Profile.jsx'
import SignToText from './pages/SignToText.jsx'
import TextToSign from './pages/TextToSign.jsx'
import Communication from './pages/Communication.jsx'
import Vocabulary from './pages/Vocabulary.jsx'
import HowItWorks from './pages/HowItWorks.jsx'

function RequireAccount({ children }) {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main className="app-main" id="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/vocabulary" element={<Vocabulary />} />

          <Route path="/role" element={(
            <RequireAccount><RoleSelection /></RequireAccount>
          )} />
          <Route path="/profile" element={(
            <RequireAccount><Profile /></RequireAccount>
          )} />
          <Route path="/sign-to-text" element={(
            <RequireAccount><SignToText /></RequireAccount>
          )} />
          <Route path="/text-to-sign" element={(
            <RequireAccount><TextToSign /></RequireAccount>
          )} />
          <Route path="/communication" element={(
            <RequireAccount><Communication /></RequireAccount>
          )} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
