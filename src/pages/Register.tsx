import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setBusy(true)
    const { error } = await signUp(form.email, form.password, form.fullName, form.phone)
    setBusy(false)
    if (error) { setError(error); return }
    navigate('/account')
  }

  return (
    <div className="container-x py-20 max-w-md">
      <h1 className="font-display text-3xl font-bold">Create your account</h1>
      <p className="text-steel text-sm mt-2">Save favorites, book test drives, and track inquiries.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
        {error && <div className="text-sm text-oxblood2 bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">{error}</div>}
        <label className="block">
          <span className="text-xs text-steel">Full name</span>
          <input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Email</span>
          <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Phone number</span>
          <input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Password</span>
          <input type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Confirm password</span>
          <input type="password" required value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className="input-field mt-1.5" />
        </label>
        <button disabled={busy} className="btn-primary mt-2">{busy ? 'Creating account…' : 'Create Account'}</button>
      </form>

      <p className="text-sm text-steel mt-6">
        Already have an account? <Link to="/login" className="text-oxblood2 hover:underline">Log in</Link>
      </p>
    </div>
  )
}
