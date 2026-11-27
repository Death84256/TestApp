import { useEffect, useState } from 'react'
import './App.css'

async function api(path, options = {}) {
  const response = await fetch(`/api/account/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || 'Something went wrong. Please try again.')
  return body
}

function App() {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [mode, setMode] = useState('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api('me')
      .then((result) => setUser(result.user))
      .catch(() => {})
      .finally(() => setCheckingSession(false))
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      if (mode === 'register') {
        await api('register', { method: 'POST', body: JSON.stringify(payload) })
        setMode('login')
        setError('Account created. Sign in with your new account.')
      } else {
        const result = await api('login', { method: 'POST', body: JSON.stringify(payload) })
        setUser(result.user)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    await api('logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    setMode('login')
  }

  if (checkingSession) return <main className="loading">Loading your workspace…</main>

  if (user) {
    return (
      <main className="dashboard-shell">
        <header className="topbar"><a className="wordmark" href="/">Esebial<span>.</span></a><button className="text-button" onClick={handleLogout}>Sign out</button></header>
        <section className="welcome-card">
          <div className="eyebrow">YOUR WORKSPACE</div>
          <div className="avatar">{(user.name || user.userId || 'U').slice(0, 1).toUpperCase()}</div>
          <h1>Welcome back, {user.name || user.userId}.</h1>
          <p>You’re signed in and ready to go.</p>
          <div className="profile-row"><span>Account ID</span><strong>{user.userId}</strong></div>
        </section>
        <footer>Made for a clearer way to work.</footer>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel">
        <a className="wordmark" href="/">Esebial<span>.</span></a>
        <div className="brand-copy">
          <div className="eyebrow">A BETTER PLACE TO BEGIN</div>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p>Your work, your people, and your next good idea — all in one place.</p>
        </div>
        <div className="brand-foot">Simple by design. Ready when you are.</div>
        <div className="orb orb-one" /><div className="orb orb-two" />
      </section>
      <section className="form-panel">
        <div className="auth-form-wrap">
          <div className="eyebrow mobile-brand">ESEBIAL</div>
          <div className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</div>
          <h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
          <p className="form-intro">{mode === 'login' ? 'Enter your details to continue.' : 'A few details and you’re on your way.'}</p>
          <form onSubmit={handleSubmit}>
            {mode === 'register' && <label>Your name<input name="name" autoComplete="name" placeholder="Jane Smith" required /></label>}
            <label>User ID<input name="userId" autoComplete="username" placeholder="Your user ID" required /></label>
            <label>Password<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Enter your password" required /></label>
            {mode === 'register' && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Enter it again" required /></label>}
            {error && <div className={error.startsWith('Account created') ? 'notice success' : 'notice'} role="status">{error}</div>}
            <button className="submit-button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}<span aria-hidden="true">↗</span></button>
          </form>
          <p className="switch-mode">{mode === 'login' ? 'New to Esebial?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>
        </div>
        <div className="form-footer">© {new Date().getFullYear()} Esebial Codebase</div>
      </section>
    </main>
  )
}

export default App
