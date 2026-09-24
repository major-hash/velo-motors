import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) { setError(error); return }
    navigate(location.state?.from?.pathname || '/account')
  }

  return (
    <div className="container-x py-20 max-w-md">
      <h1 className="font-display text-3xl font-bold">Log in</h1>
      <p className="text-steel text-sm mt-2">Welcome back to Velo Motors.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
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
