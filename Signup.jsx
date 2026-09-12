import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function Signup() {
  const { signupWithApi, continueInDemoMode } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [apiError, setApiError] = useState(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)
    if (!validate()) return

    setStatus('submitting')
    try {
      await signupWithApi(form)
      navigate('/role')
    } catch (err) {
      if (err.offline) {
        setStatus('offline')
      } else {
        setStatus('idle')
        setApiError(err.message || 'Could not create your account. Please try again.')
      }
    }
  }

  const handleDemo = () => {
    continueInDemoMode({ fullName: form.fullName, email: form.email })
    navigate('/role')
  }

  return (
    <div className="shell page">
      <div className="auth-shell">
        <div className="page-header">
          <h1>Create account</h1>
          <p>Set up your SignBridge AI account to save your role and signer preferences.</p>
        </div>

        {status === 'offline' && (
          <div className="banner banner-warning" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <p className="banner-title">Authentication service is not connected</p>
              <p>No backend is available to create a real account right now, so nothing has been
                saved. You can continue in demo mode to explore SignBridge AI.</p>
              <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleDemo}>Continue in Demo Mode</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus('idle')}>Try Again</button>
              </div>
            </div>
          </div>
        )}

        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" value={form.fullName} onChange={update('fullName')} autoComplete="name" />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          <div className="field">
            <label htmlFor="signupEmail">Email</label>
            <input id="signupEmail" type="email" value={form.email} onChange={update('email')} autoComplete="email" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="signupPassword">Password</label>
            <input id="signupPassword" type="password" value={form.password} onChange={update('password')} autoComplete="new-password" />
            <span className="field-hint">At least 8 characters.</span>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {apiError && <p className="field-error" role="alert">{apiError}</p>}

          <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: 'var(--space-4)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
