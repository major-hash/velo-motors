import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) { setError(error); return }
    navigate(location.state?.from?.pathname || '/account')
  }

  async function handleGoogle() {
    setGoogleBusy(true)
    setError('')
    const { error } = await signInWithGoogle()
    if (error) { setError(error); setGoogleBusy(false) }
  }

  return (
    <div className="container-x py-20 max-w-md">
      <h1 className="font-display text-3xl font-bold">Log in</h1>
      <p className="text-steel text-sm mt-2">Welcome back to Velo Motors.</p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleBusy}
        className="btn-outline w-full mt-8 flex items-center justify-center gap-3"
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.3 13 17.6 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/>
          <path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.6 10.7l7.9-6.1z"/>
          <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.6l-7.3-5.7c-2 1.4-4.7 2.2-8.2 2.2-6.4 0-11.7-3.5-13.6-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        {googleBusy ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-steel">or</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="text-sm text-oxblood2 bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">{error}</div>}
        <label className="block">
          <span className="text-xs text-steel">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field mt-1.5" />
        </label>
        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-xs text-oxblood2 hover:underline">Forgot password?</Link>
        </div>
        <button disabled={busy} className="btn-primary mt-2">{busy ? 'Logging in…' : 'Log in'}</button>
      </form>

      <p className="text-sm text-steel mt-6">
        Don't have an account? <Link to="/register" className="text-oxblood2 hover:underline">Create one</Link>
      </p>
    </div>
  )
}
