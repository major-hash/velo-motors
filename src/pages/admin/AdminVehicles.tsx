import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Vehicle } from '../../types'

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    let query = supabase.from('vehicles').select('*, vehicle_images(*)').order('created_at', { ascending: false })
    if (search) query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,stock_number.ilike.%${search}%`)
    const { data } = await query
    setVehicles((data as Vehicle[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  async function updateStatus(id: string, status: Vehicle['status']) {
    await supabase.from('vehicles').update({ status }).eq('id', id)
    load()
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await supabase.from('vehicles').update({ featured: !featured }).eq('id', id)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this vehicle permanently? This cannot be undone.')) return
    await supabase.from('vehicles').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold">Vehicles</h1>
        <div className="flex gap-3">
          <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field w-56" />
          <Link to="/admin/vehicles/new" className="btn-primary">Add Vehicle</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-steel text-sm">Loading…</div>
      ) : (
        <div className="overflow-x-auto card-surface">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left text-steel text-xs border-b border-white/10">
                <th className="p-3">Image</th><th className="p-3">Vehicle</th><th className="p-3">Price</th>
                <th className="p-3">Mileage</th><th className="p-3">Status</th><th className="p-3">Featured</th>
                <th className="p-3">Created</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-white/[0.06]">
                  <td className="p-3">
                    <img src={v.vehicle_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80'} className="w-16 h-12 object-cover rounded-sm" alt="" />
                  </td>
                  <td className="p-3">{v.year} {v.make} {v.model}</td>
                  <td className="p-3">${v.price.toLocaleString()}</td>
                  <td className="p-3">{v.mileage.toLocaleString()}</td>
                  <td className="p-3">
                    <select value={v.status} onChange={(e) => updateStatus(v.id, e.target.value as Vehicle['status'])} className="input-field py-1.5 text-xs">
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleFeatured(v.id, v.featured)} className={v.featured ? 'text-oxblood2' : 'text-steel'}>
                      {v.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </td>
                  <td className="p-3 text-steel text-xs">{new Date(v.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-3 text-xs">
                      <Link to={`/vehicle/${v.id}`} className="text-steel hover:text-white">View</Link>
                      <Link to={`/admin/vehicles/${v.id}/edit`} className="text-steel hover:text-white">Edit</Link>
                      <button onClick={() => remove(v.id)} className="text-oxblood2">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-steel">No vehicles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
