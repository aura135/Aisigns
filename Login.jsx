import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { loginWithApi, continueInDemoMode } = useApp()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | offline
  const [apiError, setApiError] = useState(null)

  const validate = () => {
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError(null)
    if (!validate()) return

    setStatus('submitting')
    try {
      await loginWithApi(email, password)
      navigate('/role')
    } catch (err) {
      if (err.offline) {
        setStatus('offline')
      } else {
        setStatus('idle')
        setApiError(err.message || 'Login failed. Please check your details and try again.')
      }
    }
  }

  const handleDemo = () => {
    continueInDemoMode({ email })
    navigate('/role')
  }

  return (
    <div className="shell page">
      <div className="auth-shell">
        <div className="page-header">
          <h1>Sign in</h1>
          <p>Sign in to continue to your SignBridge AI experience.</p>
        </div>

        {status === 'offline' && (
          <div className="banner banner-warning" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            <div>
              <p className="banner-title">Authentication service is not connected</p>
              <p>SignBridge AI could not reach a backend to verify your account. You can continue
                in demo mode to explore the app, or try again once a backend is connected.</p>
              <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleDemo}>Continue in Demo Mode</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus('idle')}>Try Again</button>
              </div>
            </div>
          </div>
        )}

        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <span className="field-error" id="password-error">{errors.password}</span>}
          </div>

          {apiError && <p className="field-error" role="alert">{apiError}</p>}

          <div className="btn-row">
            <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Signing in…' : 'Login'}
            </button>
            <button type="button" className="btn btn-ghost">Forgot Password</button>
          </div>
        </form>

        <p style={{ marginTop: 'var(--space-4)' }}>
          New to SignBridge AI? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  )
}
