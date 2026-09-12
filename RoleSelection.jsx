import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function RoleSelection() {
  const { session, setRole } = useApp()
  const navigate = useNavigate()

  const choose = (role) => {
    setRole(role)
    navigate(role === 'sign' ? '/sign-to-text' : '/text-to-sign')
  }

  return (
    <div className="shell page">
      <div className="page-header">
        <h1>How will you communicate?</h1>
        <p>Choose the experience that matches how you'll use SignBridge AI. You can switch anytime from your profile.</p>
      </div>

      <div className="role-grid">
        <button type="button" className={`role-card ${session?.role === 'sign' ? 'selected' : ''}`} onClick={() => choose('sign')}>
          <div className="role-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <h3>Sign User</h3>
          <p>For people who communicate using Indian Sign Language. Uses the camera to turn your
            signs into English text and speech.</p>
        </button>

        <button type="button" className={`role-card ${session?.role === 'text' ? 'selected' : ''}`} onClick={() => choose('text')}>
          <div className="role-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="#fff" strokeWidth="2" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <h3>Text User</h3>
          <p>For people who communicate through text or voice. Turns what you type or say into an
            ISL sign sequence performed by an animated signer.</p>
        </button>
      </div>
    </div>
  )
}
