import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Favorite, TestDriveRequest, Inquiry } from '../types'
import { Link } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'

type Tab = 'profile' | 'favorites' | 'test-drives' | 'inquiries' | 'settings'

export default function Account() {
  const [tab, setTab] = useState<Tab>('profile')
  const { profile } = useAuth()

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'favorites', label: 'My Favorites' },
    { id: 'test-drives', label: 'My Test Drives' },
    { id: 'inquiries', label: 'My Inquiries' },
    { id: 'settings', label: 'Account Settings' },
  ]

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-bold mb-1">My Account</h1>
      <p className="text-steel text-sm mb-8">Welcome back, {profile?.full_name || 'there'}.</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-4 py-2.5 rounded-sm text-sm whitespace-nowrap ${tab === t.id ? 'bg-charcoal2 text-white' : 'text-steel hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'profile' && <ProfileTab />}
          {tab === 'favorites' && <FavoritesTab />}
          {tab === 'test-drives' && <TestDrivesTab />}
          {tab === 'inquiries' && <InquiriesTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

function ProfileTab() {
  const { profile, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [status, setStatus] = useState<'idle' | 'busy' | 'done'>('idle')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    await updateProfile({ full_name: fullName, phone })
    setStatus('done')
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="card-surface p-6 max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-charcoal2 flex items-center justify-center text-xl font-semibold">
          {(profile?.full_name || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{profile?.full_name}</div>
          <div className="text-steel text-sm">{profile?.email}</div>
          <div className="text-steel text-xs mt-0.5">Member since {profile ? new Date(profile.created_at).toLocaleDateString() : ''}</div>
        </div>
      </div>
      <form onSubmit={save} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-xs text-steel">Full name</span>
          <input className="input-field mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Phone</span>
          <input className="input-field mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <button className="btn-primary self-start">{status === 'busy' ? 'Saving…' : status === 'done' ? 'Saved' : 'Save changes'}</button>
      </form>
    </div>
  )
}

function FavoritesTab() {
  const { user } = useAuth()
  const [favs, setFavs] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('favorites').select('*, vehicles(*, vehicle_images(*))').eq('user_id', user.id).then(({ data }) => {
      setFavs((data as any) ?? [])
      setLoading(false)
    })
  }, [user])

  if (loading) return <div className="text-steel text-sm">Loading…</div>
  if (favs.length === 0) return (
    <div className="card-surface p-10 text-center">
      <p className="text-steel">You haven't saved any vehicles yet.</p>
      <Link to="/inventory" className="btn-primary inline-block mt-4">Browse Inventory</Link>
    </div>
  )
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {favs.filter((f) => f.vehicles).map((f) => <VehicleCard key={f.id} vehicle={f.vehicles!} />)}
    </div>
  )
}

function TestDrivesTab() {
  const { user } = useAuth()
  const [rows, setRows] = useState<TestDriveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('test_drive_requests').select('*, vehicles(*)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as any) ?? [])
      setLoading(false)
    })
  }, [user])

  if (loading) return <div className="text-steel text-sm">Loading…</div>
  if (rows.length === 0) return <div className="card-surface p-10 text-center text-steel">No test drive requests yet.</div>

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.id} className="card-surface p-5 flex justify-between items-center flex-wrap gap-3">
          <div>
            <div className="font-medium">{r.vehicles ? `${r.vehicles.year} ${r.vehicles.make} ${r.vehicles.model}` : 'Vehicle'}</div>
            <div className="text-steel text-sm mt-0.5">{r.preferred_date} at {r.preferred_time} · Requested {new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <StatusPill status={r.status} />
        </div>
      ))}
    </div>
  )
}

function InquiriesTab() {
  const { user } = useAuth()
  const [rows, setRows] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('inquiries').select('*, vehicles(*)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as any) ?? [])
      setLoading(false)
    })
  }, [user])

  if (loading) return <div className="text-steel text-sm">Loading…</div>
  if (rows.length === 0) return <div className="card-surface p-10 text-center text-steel">No inquiries yet.</div>

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.id} className="card-surface p-5">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="font-medium">{r.subject}</div>
              <div className="text-steel text-sm mt-0.5">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            <StatusPill status={r.status} />
          </div>
          <p className="text-steel text-sm mt-3">{r.message}</p>
        </div>
      ))}
    </div>
  )
}

function SettingsTab() {
  const { updatePassword, signOut } = useAuth()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setStatus('error'); return }
    setStatus('busy')
    const { error } = await updatePassword(password)
    setStatus(error ? 'error' : 'done')
    setPassword('')
  }

  return (
    <div className="card-surface p-6 max-w-lg flex flex-col gap-8">
      <form onSubmit={save} className="flex flex-col gap-4">
        <h3 className="font-display font-semibold text-lg">Change password</h3>
        {status === 'error' && <div className="text-sm text-oxblood2">Password must be at least 8 characters.</div>}
        {status === 'done' && <div className="text-sm text-green-400">Password updated.</div>}
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
        <button className="btn-primary self-start">{status === 'busy' ? 'Updating…' : 'Update password'}</button>
      </form>
      <div className="border-t border-white/10 pt-6">
        <button onClick={() => signOut()} className="btn-outline">Logout</button>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400', new: 'bg-yellow-500/15 text-yellow-400',
    confirmed: 'bg-blue-500/15 text-blue-400', contacted: 'bg-blue-500/15 text-blue-400',
    completed: 'bg-green-500/15 text-green-400', resolved: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-oxblood/15 text-oxblood2', declined: 'bg-oxblood/15 text-oxblood2',
    reviewing: 'bg-purple-500/15 text-purple-400',
  }
  return <span className={`text-xs px-2.5 py-1 rounded-sm capitalize ${colors[status] || 'bg-white/10 text-steel'}`}>{status}</span>
}
