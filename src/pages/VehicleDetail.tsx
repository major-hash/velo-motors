import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, whatsappLink } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useCompare } from '../context/CompareContext'
import type { Vehicle } from '../types'
import FavoriteButton from '../components/FavoriteButton'
import FinancingCalculator from '../components/FinancingCalculator'

const FEATURE_CATEGORIES = ['Safety', 'Comfort', 'Technology', 'Performance']

function money(n: number) { return '$' + Math.round(n).toLocaleString('en-US') }

export default function VehicleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toggle, isIn } = useCompare()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const [showTestDrive, setShowTestDrive] = useState(false)
  const [showInquiry, setShowInquiry] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) { setError('This vehicle could not be found.'); setLoading(false); return }
        const v = data as Vehicle
        v.vehicle_images = (v.vehicle_images ?? []).sort((a, b) => a.display_order - b.display_order)
        setVehicle(v)
        document.title = `${v.year} ${v.make} ${v.model} | Velo Motors`
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="container-x py-24 text-steel text-center">Loading…</div>
  if (error || !vehicle) return (
    <div className="container-x py-24 text-center">
      <p className="text-steel">{error || 'Vehicle not found.'}</p>
      <Link to="/inventory" className="btn-primary inline-block mt-6">Back to inventory</Link>
    </div>
  )

  const images = vehicle.vehicle_images && vehicle.vehicle_images.length > 0
    ? vehicle.vehicle_images
    : [{ id: 'placeholder', vehicle_id: vehicle.id, image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', display_order: 0, created_at: '' }]

  const waMsg = `Hello Velo Motors, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`

  return (
    <div className="container-x py-10">
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10">
        <div>
          <div className="relative aspect-[4/3] card-surface overflow-hidden cursor-zoom-in" onClick={() => setFullscreen(true)}>
            <img src={images[activeImg].image_url} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg - 1 + images.length) % images.length) }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center">‹</button>
                <button onClick={(e) => { e.stopPropagation(); setActiveImg((activeImg + 1) % images.length) }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center">›</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setActiveImg(i)} className={`w-20 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 ${i === activeImg ? 'border-oxblood' : 'border-transparent'}`}>
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold mb-3">Description</h2>
            <p className="text-steel text-sm leading-relaxed">{vehicle.description || 'No description provided for this vehicle yet.'}</p>
          </div>

          {vehicle.features && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold mb-4">Features</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {FEATURE_CATEGORIES.filter((c) => vehicle.features?.[c]?.length).map((cat) => (
                  <div key={cat}>
                    <div className="text-xs text-oxblood2 uppercase tracking-wide mb-2">{cat}</div>
                    <ul className="text-sm text-steel space-y-1.5">
                      {vehicle.features![cat].map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <FinancingCalculator initialPrice={vehicle.price} />
          </div>
        </div>

        <div>
          <div className="card-surface p-6 sticky top-24">
            <div className="flex justify-between items-start">
              <h1 className="font-display text-2xl font-bold leading-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <FavoriteButton vehicleId={vehicle.id} />
            </div>
            {vehicle.trim && <p className="text-steel text-sm mt-1">{vehicle.trim}</p>}
            <div className="font-display text-3xl font-bold mt-4">{money(vehicle.price)}</div>
            {vehicle.status !== 'available' && (
              <span className="inline-block mt-2 bg-oxblood text-white text-xs px-2.5 py-1 rounded-sm uppercase">{vehicle.status}</span>
            )}

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mt-6 pt-6 border-t border-white/10">
              <Spec label="Mileage" value={`${vehicle.mileage.toLocaleString()} mi`} />
              <Spec label="Condition" value={vehicle.condition} />
              <Spec label="Engine" value={vehicle.engine || '—'} />
              <Spec label="Transmission" value={vehicle.transmission} />
              <Spec label="Fuel" value={vehicle.fuel_type} />
              <Spec label="Drivetrain" value={vehicle.drivetrain} />
              <Spec label="Horsepower" value={vehicle.horsepower ? `${vehicle.horsepower} hp` : '—'} />
              <Spec label="Exterior" value={vehicle.exterior_color} />
              <Spec label="Interior" value={vehicle.interior_color || '—'} />
              <Spec label="Stock #" value={vehicle.stock_number} />
              <Spec label="VIN" value={vehicle.vin} />
            </div>

            <div className="flex flex-col gap-2.5 mt-6">
              <button onClick={() => setShowTestDrive(true)} className="btn-primary">Schedule Test Drive</button>
              <button onClick={() => setShowInquiry(true)} className="btn-outline">Request More Information</button>
              <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn-outline text-center">Chat on WhatsApp</a>
              <button
                onClick={() => toggle(vehicle.id)}
                className={`text-sm mt-1 ${isIn(vehicle.id) ? 'text-oxblood2' : 'text-steel hover:text-white'}`}
              >
                {isIn(vehicle.id) ? '✓ Added to comparison' : '+ Add to comparison'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6" onClick={() => setFullscreen(false)}>
          <img src={images[activeImg].image_url} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {showTestDrive && <TestDriveModal vehicle={vehicle} onClose={() => setShowTestDrive(false)} loggedIn={!!user} />}
      {showInquiry && <InquiryModal vehicle={vehicle} onClose={() => setShowInquiry(false)} />}
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-steel text-xs">{label}</div>
      <div className="mt-0.5">{value}</div>
    </div>
  )
}

function TestDriveModal({ vehicle, onClose, loggedIn }: { vehicle: Vehicle; onClose: () => void; loggedIn: boolean }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    fullName: profile?.full_name || '', email: profile?.email || user?.email || '',
    phone: profile?.phone || '', date: '', time: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setStatus('busy')
    const { error } = await supabase.from('test_drive_requests').insert({
      user_id: user.id, vehicle_id: vehicle.id,
      full_name: form.fullName, email: form.email, phone: form.phone,
      preferred_date: form.date, preferred_time: form.time, message: form.message || null,
      status: 'pending',
    })
    setStatus(error ? 'error' : 'done')
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div className="card-surface bg-charcoal2 max-w-md w-full p-7" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl font-semibold">Schedule a test drive</h3>
        <p className="text-steel text-sm mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>

        {!loggedIn ? (
          <div className="mt-6 text-sm">
            <p className="text-steel">Please log in to request a test drive.</p>
            <Link to="/login" className="btn-primary inline-block mt-4">Log in</Link>
          </div>
        ) : status === 'done' ? (
          <p className="text-sm text-green-400 mt-6">Test drive request submitted successfully.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 mt-5">
            {status === 'error' && <div className="text-sm text-oxblood2">Something went wrong. Please try again.</div>}
            <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            <input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
              <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" />
            </div>
            <textarea placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field min-h-[70px]" />
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
              <button disabled={status === 'busy'} className="btn-primary flex-1">{status === 'busy' ? 'Sending…' : 'Submit request'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function InquiryModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    name: profile?.full_name || '', email: profile?.email || user?.email || '',
    phone: profile?.phone || '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    const { error } = await supabase.from('inquiries').insert({
      user_id: user?.id ?? null, vehicle_id: vehicle.id,
      name: form.name, email: form.email, phone: form.phone || null,
      subject: `Inquiry: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      message: form.message, status: 'new',
    })
    setStatus(error ? 'error' : 'done')
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div className="card-surface bg-charcoal2 max-w-md w-full p-7" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-xl font-semibold">Request more information</h3>
        <p className="text-steel text-sm mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>

        {status === 'done' ? (
          <p className="text-sm text-green-400 mt-6">Your request has been submitted successfully.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 mt-5">
            {status === 'error' && <div className="text-sm text-oxblood2">Something went wrong. Please try again.</div>}
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field min-h-[90px]" />
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
              <button disabled={status === 'busy'} className="btn-primary flex-1">{status === 'busy' ? 'Sending…' : 'Submit'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
