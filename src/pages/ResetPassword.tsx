import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setBusy(true)
    const { error } = await updatePassword(password)
    setBusy(false)
    if (error) { setError(error); return }
    setDone(true)
    setTimeout(() => navigate('/account'), 1500)
  }

  return (
    <div className="container-x py-20 max-w-md">
      <h1 className="font-display text-3xl font-bold">Set a new password</h1>
      <p className="text-steel text-sm mt-2">You arrived here from your reset-password email link.</p>

      {done ? (
        <div className="mt-8 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-sm px-4 py-3">
          Password updated. Redirecting to your account…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          {error && <div className="text-sm text-oxblood2 bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">{error}</div>}
          <label className="block">
            <span className="text-xs text-steel">New password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field mt-1.5" />
          </label>
          <label className="block">
            <span className="text-xs text-steel">Confirm new password</span>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field mt-1.5" />
          </label>
          <button disabled={busy} className="btn-primary mt-2">{busy ? 'Saving…' : 'Update password'}</button>
        </form>
      )}
    </div>
  )
}
