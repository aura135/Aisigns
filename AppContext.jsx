import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { checkHealth, isBackendConfigured, login as apiLogin, signup as apiSignup } from '../services/api'

const AppContext = createContext(null)

const STORAGE_KEY = 'signbridge.session'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(() => loadSession())
  const [signerGender, setSignerGender] = useState('girl')
  const [apiStatus, setApiStatus] = useState('checking') // checking | connected | offline

  useEffect(() => saveSession(session), [session])

  const refreshHealth = useCallback(async () => {
    if (!isBackendConfigured()) {
      setApiStatus('offline')
      return
    }
    setApiStatus('checking')
    try {
      await checkHealth()
      setApiStatus('connected')
    } catch {
      setApiStatus('offline')
    }
  }, [])

  useEffect(() => {
    refreshHealth()
    const interval = setInterval(refreshHealth, 30000)
    return () => clearInterval(interval)
  }, [refreshHealth])

  const loginWithApi = useCallback(async (email, password) => {
    const result = await apiLogin(email, password)
    const nextSession = { user: result.user || { email }, role: null, demo: false }
    setSession(nextSession)
    return nextSession
  }, [])

  const signupWithApi = useCallback(async ({ fullName, email, password }) => {
    const result = await apiSignup({ fullName, email, password })
    const nextSession = { user: result.user || { fullName, email }, role: null, demo: false }
    setSession(nextSession)
    return nextSession
  }, [])

  const continueInDemoMode = useCallback((profile = {}) => {
    const nextSession = {
      user: { fullName: profile.fullName || 'Demo User', email: profile.email || 'demo@signbridge.ai' },
      role: null,
      demo: true,
    }
    setSession(nextSession)
    return nextSession
  }, [])

  const setRole = useCallback((role) => {
    setSession((prev) => (prev ? { ...prev, role } : prev))
  }, [])

  const logout = useCallback(() => setSession(null), [])

  const value = useMemo(() => ({
    session,
    isAuthenticated: Boolean(session),
    apiStatus,
    refreshHealth,
    loginWithApi,
    signupWithApi,
    continueInDemoMode,
    setRole,
    logout,
    signerGender,
    setSignerGender,
  }), [session, apiStatus, refreshHealth, loginWithApi, signupWithApi, continueInDemoMode, setRole, logout, signerGender])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
