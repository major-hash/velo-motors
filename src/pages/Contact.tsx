import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    const { error } = await supabase.from('inquiries').insert({
      user_id: null, vehicle_id: null,
      name: form.name, email: form.email, phone: form.phone || null,
      subject: form.subject || 'General inquiry', message: form.message, status: 'new',
    })
    setStatus(error ? 'error' : 'done')
  }

  return (
    <div className="container-x py-16 grid md:grid-cols-2 gap-14">
      <div>
        <h1 className="font-display text-4xl font-bold">Get in touch</h1>
        <p className="text-steel text-sm mt-3 max-w-sm leading-relaxed">Questions about a vehicle, financing, or trade-in? Send a message or stop by the lot.</p>

        <div className="mt-10 flex flex-col gap-5 text-sm">
          <div><div className="text-steel text-xs">Address</div><div className="mt-0.5">4110 Frontage Road, Your City</div></div>
          <div><div className="text-steel text-xs">Phone</div><div className="mt-0.5">(555) 019-2244</div></div>
          <div><div className="text-steel text-xs">Email</div><div className="mt-0.5">hello@velomotors.example</div></div>
          <div><div className="text-steel text-xs">Hours</div><div className="mt-0.5">Mon–Sat, 9am–7pm. Closed Sundays.</div></div>
        </div>

        <div className="mt-8 aspect-[16/9] card-surface flex items-center justify-center text-steel text-sm">
          Map placeholder — connect Google Maps with your dealership address.
        </div>
      </div>

      <div>
        {status === 'done' ? (
          <div className="card-surface p-8 text-center">
            <p className="text-green-400">Your message has been sent. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            {status === 'error' && <div className="text-sm text-oxblood2">Something went wrong. Please try again.</div>}
            <input required placeholder="Name" value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" />
            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" />
            <input placeholder="Subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} className="input-field" />
            <textarea required placeholder="Message" value={form.message} onChange={(e) => set('message', e.target.value)} className="input-field min-h-[140px]" />
            <button disabled={status === 'busy'} className="btn-primary self-start">{status === 'busy' ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
