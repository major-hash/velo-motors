import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function SellYourCar() {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    fullName: profile?.full_name || '', email: profile?.email || user?.email || '', phone: profile?.phone || '',
    make: '', model: '', year: '', mileage: '', condition: 'Used', askingPrice: '', location: '', description: '',
  })
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    const { error } = await supabase.from('sell_requests').insert({
      user_id: user?.id ?? null,
      full_name: form.fullName, email: form.email, phone: form.phone,
      make: form.make, model: form.model, year: Number(form.year), mileage: Number(form.mileage),
      condition: form.condition, asking_price: Number(form.askingPrice), location: form.location,
      description: form.description || null, status: 'new',
    })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <div className="container-x py-24 max-w-md text-center">
        <h1 className="font-display text-2xl font-bold">Thanks — we've got it.</h1>
        <p className="text-steel text-sm mt-3">Our buying team reviews new submissions daily and will reach out at the email or phone you provided.</p>
      </div>
    )
  }

  return (
    <div className="container-x py-16 max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Want to Sell Your Car?</h1>
      <p className="text-steel text-sm mt-2">Tell us about your vehicle and we'll follow up with an offer.</p>

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 mt-8">
        {status === 'error' && <div className="sm:col-span-2 text-sm text-oxblood2">Something went wrong. Please check the form and try again.</div>}
        <input required placeholder="Full name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className="input-field" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" />
        <input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" />
        <input required placeholder="Location (city, state)" value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field" />
        <input required placeholder="Make" value={form.make} onChange={(e) => set('make', e.target.value)} className="input-field" />
        <input required placeholder="Model" value={form.model} onChange={(e) => set('model', e.target.value)} className="input-field" />
        <input required type="number" placeholder="Year" value={form.year} onChange={(e) => set('year', e.target.value)} className="input-field" />
        <input required type="number" placeholder="Mileage" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} className="input-field" />
        <select value={form.condition} onChange={(e) => set('condition', e.target.value)} className="input-field">
          <option>Excellent</option><option>Good</option><option>Fair</option><option>Needs work</option>
        </select>
        <input required type="number" placeholder="Asking price ($)" value={form.askingPrice} onChange={(e) => set('askingPrice', e.target.value)} className="input-field" />
        <textarea placeholder="Description (condition notes, history, extras)" value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field sm:col-span-2 min-h-[100px]" />
        <p className="sm:col-span-2 text-xs text-steel -mt-1">Photo upload is available once you're logged in and connected to Supabase Storage — this demo form stores the listing details.</p>
        <button disabled={status === 'busy'} className="btn-primary sm:col-span-2">{status === 'busy' ? 'Submitting…' : 'Submit for review'}</button>
      </form>
    </div>
  )
}
