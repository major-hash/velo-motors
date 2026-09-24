import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await sendPasswordReset(email)
    setBusy(false)
    if (error) { setError(error); return }
    setSent(true)
  }

  return (
    <div className="container-x py-20 max-w-md">
      <h1 className="font-display text-3xl font-bold">Reset your password</h1>
      <p className="text-steel text-sm mt-2">We'll email you a secure reset link.</p>

      {sent ? (
        <div className="mt-8 text-sm bg-charcoal2 border border-white/10 rounded-sm px-4 py-4">
          If an account exists for {email}, a reset link is on its way. Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
          {error && <div className="text-sm text-oxblood2 bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">{error}</div>}
          <label className="block">
            <span className="text-xs text-steel">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mt-1.5" />
          </label>
          <button disabled={busy} className="btn-primary mt-2">{busy ? 'Sending…' : 'Send reset link'}</button>
        </form>
      )}

      <p className="text-sm text-steel mt-6"><Link to="/login" className="text-oxblood2 hover:underline">Back to login</Link></p>
    </div>
  )
}
