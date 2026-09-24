import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Vehicle, VehicleImage } from '../../types'

const FEATURE_CATEGORIES = ['Safety', 'Comfort', 'Technology', 'Performance']
const BLANK = {
  make: '', model: '', year: new Date().getFullYear(), trim: '', price: 0, mileage: 0,
  condition: 'Used', body_type: 'Sedan', fuel_type: 'Gasoline', transmission: 'Automatic',
  drivetrain: 'FWD', engine: '', horsepower: 0, exterior_color: '', interior_color: '',
  description: '', stock_number: '', vin: '', status: 'available' as Vehicle['status'], featured: false,
}

export default function AdminVehicleForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState<any>(BLANK)
  const [features, setFeatures] = useState<Record<string, string[]>>({ Safety: [], Comfort: [], Technology: [], Performance: [] })
  const [images, setImages] = useState<VehicleImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    supabase.from('vehicles').select('*, vehicle_images(*)').eq('id', id).single().then(({ data }) => {
      if (!data) return
      const v = data as Vehicle
      setForm(v)
      setFeatures(v.features || { Safety: [], Comfort: [], Technology: [], Performance: [] })
      setImages((v.vehicle_images ?? []).sort((a, b) => a.display_order - b.display_order))
    })
  }, [id])

  function set(k: string, val: any) { setForm((f: any) => ({ ...f, [k]: val })) }

  function setFeatureList(cat: string, text: string) {
    setFeatures((f) => ({ ...f, [cat]: text.split('\n').map((s) => s.trim()).filter(Boolean) }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit || !e.target.files) return
    setUploading(true)
    const files = Array.from(e.target.files)
    for (const file of files) {
      const path = `${id}/${Date.now()}-${file.name}`
      const { error: upErr } = await supabase.storage.from('vehicle-images').upload(path, file)
      if (upErr) { setError(`Upload failed: ${upErr.message}`); continue }
      const { data: pub } = supabase.storage.from('vehicle-images').getPublicUrl(path)
      await supabase.from('vehicle_images').insert({
        vehicle_id: id, image_url: pub.publicUrl, display_order: images.length,
      })
    }
    const { data } = await supabase.from('vehicle_images').select('*').eq('vehicle_id', id).order('display_order')
    setImages((data as VehicleImage[]) ?? [])
    setUploading(false)
  }

  async function removeImage(imgId: string) {
    await supabase.from('vehicle_images').delete().eq('id', imgId)
    setImages((imgs) => imgs.filter((i) => i.id !== imgId))
  }

  async function moveImage(index: number, dir: -1 | 1) {
    const next = [...images]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setImages(next)
    await Promise.all(next.map((img, i) => supabase.from('vehicle_images').update({ display_order: i }).eq('id', img.id)))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('busy')
    setError('')
    const payload = { ...form, features }
    delete payload.vehicle_images
    delete payload.id
    delete payload.created_at
    delete payload.updated_at

    if (isEdit) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', id)
      if (error) { setError(error.message); setStatus('error'); return }
      navigate('/admin/vehicles')
    } else {
      const { data, error } = await supabase.from('vehicles').insert(payload).select().single()
      if (error) { setError(error.message); setStatus('error'); return }
      // Redirect into edit mode so images can be uploaded against a real vehicle id
      navigate(`/admin/vehicles/${data.id}/edit`)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="flex flex-col gap-6">
          {error && <div className="text-sm text-oxblood2 bg-oxblood/10 border border-oxblood/30 rounded-sm px-4 py-3">{error}</div>}

          <Section title="Basic information">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Make"><input required className="input-field" value={form.make} onChange={(e) => set('make', e.target.value)} /></Field>
              <Field label="Model"><input required className="input-field" value={form.model} onChange={(e) => set('model', e.target.value)} /></Field>
              <Field label="Trim"><input className="input-field" value={form.trim || ''} onChange={(e) => set('trim', e.target.value)} /></Field>
              <Field label="Year"><input required type="number" className="input-field" value={form.year} onChange={(e) => set('year', Number(e.target.value))} /></Field>
              <Field label="Price ($)"><input required type="number" className="input-field" value={form.price} onChange={(e) => set('price', Number(e.target.value))} /></Field>
              <Field label="Mileage"><input required type="number" className="input-field" value={form.mileage} onChange={(e) => set('mileage', Number(e.target.value))} /></Field>
            </div>
          </Section>

          <Section title="Specifications">
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Condition">
                <select className="input-field" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                  <option>New</option><option>Used</option><option>Certified Pre-Owned</option>
                </select>
              </Field>
              <Field label="Body type">
                <select className="input-field" value={form.body_type} onChange={(e) => set('body_type', e.target.value)}>
                  {['Sedan','SUV','Truck','Coupe','Hatchback','Convertible','Minivan'].map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Fuel type">
                <select className="input-field" value={form.fuel_type} onChange={(e) => set('fuel_type', e.target.value)}>
                  {['Gasoline','Hybrid','Electric','Diesel'].map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Transmission">
                <select className="input-field" value={form.transmission} onChange={(e) => set('transmission', e.target.value)}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </Field>
              <Field label="Drivetrain">
                <select className="input-field" value={form.drivetrain} onChange={(e) => set('drivetrain', e.target.value)}>
                  {['FWD','RWD','AWD','4WD'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Horsepower"><input type="number" className="input-field" value={form.horsepower || ''} onChange={(e) => set('horsepower', Number(e.target.value))} /></Field>
              <Field label="Engine"><input className="input-field" value={form.engine || ''} onChange={(e) => set('engine', e.target.value)} /></Field>
              <Field label="Exterior color"><input required className="input-field" value={form.exterior_color} onChange={(e) => set('exterior_color', e.target.value)} /></Field>
              <Field label="Interior color"><input className="input-field" value={form.interior_color || ''} onChange={(e) => set('interior_color', e.target.value)} /></Field>
              <Field label="VIN"><input required className="input-field" value={form.vin} onChange={(e) => set('vin', e.target.value)} /></Field>
              <Field label="Stock number"><input required className="input-field" value={form.stock_number} onChange={(e) => set('stock_number', e.target.value)} /></Field>
            </div>
          </Section>

          <Section title="Description">
            <textarea className="input-field min-h-[120px]" value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
          </Section>

          <Section title="Features (one per line, per category)">
            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURE_CATEGORIES.map((cat) => (
                <Field key={cat} label={cat}>
                  <textarea className="input-field min-h-[90px]" value={(features[cat] || []).join('\n')} onChange={(e) => setFeatureList(cat, e.target.value)} />
                </Field>
              ))}
            </div>
          </Section>

          <Section title="Images">
            {!isEdit ? (
              <p className="text-steel text-sm">Save the vehicle first, then upload images on the edit screen.</p>
            ) : (
              <>
                <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} className="text-sm text-steel" />
                {uploading && <p className="text-xs text-steel mt-2">Uploading…</p>}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, i) => (
                    <div key={img.id} className="relative card-surface overflow-hidden">
                      <img src={img.image_url} className="w-full aspect-square object-cover" alt="" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 flex justify-between px-1 py-1">
                        <button type="button" onClick={() => moveImage(i, -1)} className="text-white text-xs px-1">←</button>
                        <button type="button" onClick={() => removeImage(img.id)} className="text-oxblood2 text-xs px-1">✕</button>
                        <button type="button" onClick={() => moveImage(i, 1)} className="text-white text-xs px-1">→</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>
        </div>

        <div>
          <div className="card-surface p-6 sticky top-24 flex flex-col gap-4">
            <Field label="Status">
              <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured on homepage
            </label>
            <button disabled={status === 'busy'} className="btn-primary">
              {status === 'busy' ? 'Saving…' : isEdit ? 'Save changes' : 'Create vehicle'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-surface p-6">
      <h3 className="font-display font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-steel">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
