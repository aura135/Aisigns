import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function Profile() {
  const { session, logout, signerGender, setSignerGender, setRole } = useApp()
  const navigate = useNavigate()

  const [language, setLanguage] = useState('English')
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="shell page" style={{ fontSize: largeText ? '1.1rem' : undefined }}>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account, role, and accessibility preferences.</p>
      </div>

      <div className="stack" style={{ maxWidth: 560 }}>
        <div className="card">
          <h3 className="mt-0">Account</h3>
          <div className="recognition-row">
            <span className="muted">Name</span>
            <strong>{session?.user?.fullName || '—'}</strong>
          </div>
          <div className="recognition-row">
            <span className="muted">Email</span>
            <strong>{session?.user?.email || '—'}</strong>
          </div>
          <div className="recognition-row">
            <span className="muted">Account type</span>
            <strong>{session?.demo ? 'Demo session' : 'Registered'}</strong>
          </div>
        </div>

        <div className="card">
          <h3 className="mt-0">Role</h3>
          <p>You're currently set up as a <strong>{session?.role === 'sign' ? 'Sign User' : session?.role === 'text' ? 'Text User' : 'no role yet'}</strong>.</p>
          <div className="btn-row">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setRole('sign')}>Use Sign User</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setRole('text')}>Use Text User</button>
          </div>
        </div>

        <div className="card">
          <h3 className="mt-0">Preferences</h3>
          <div className="field">
            <label htmlFor="language">Language preference</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="signer">Signer preference</label>
            <div className="gender-toggle" id="signer">
              <button type="button" className={signerGender === 'boy' ? 'active' : ''} onClick={() => setSignerGender('boy')}>Boy</button>
              <button type="button" className={signerGender === 'girl' ? 'active' : ''} onClick={() => setSignerGender('girl')}>Girl</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mt-0">Accessibility settings</h3>
          <label className="row" style={{ marginBottom: 'var(--space-3)' }}>
            <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
            Larger text across the app
          </label>
          <label className="row">
            <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
            High-contrast mode
          </label>
          {highContrast && (
            <p className="muted" style={{ marginTop: 'var(--space-3)' }}>
              High-contrast styling will apply across SignBridge AI screens.
            </p>
          )}
        </div>

        <button type="button" className="btn btn-danger" onClick={handleLogout} style={{ alignSelf: 'flex-start' }}>
          Logout
        </button>
      </div>
    </div>
  )
}
