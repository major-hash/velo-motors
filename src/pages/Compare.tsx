import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCompare } from '../context/CompareContext'
import type { Vehicle } from '../types'

const ROWS: { label: string; key: keyof Vehicle | ((v: Vehicle) => string) }[] = [
  { label: 'Price', key: (v) => '$' + v.price.toLocaleString() },
  { label: 'Year', key: 'year' },
  { label: 'Mileage', key: (v) => `${v.mileage.toLocaleString()} mi` },
  { label: 'Engine', key: (v) => v.engine || '—' },
  { label: 'Horsepower', key: (v) => v.horsepower ? `${v.horsepower} hp` : '—' },
  { label: 'Transmission', key: 'transmission' },
  { label: 'Fuel', key: 'fuel_type' },
  { label: 'Drivetrain', key: 'drivetrain' },
  { label: 'Body type', key: 'body_type' },
  { label: 'Condition', key: 'condition' },
]

export default function Compare() {
  const { ids, toggle, clear } = useCompare()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) { setVehicles([]); setLoading(false); return }
    setLoading(true)
    supabase.from('vehicles').select('*, vehicle_images(*)').in('id', ids).then(({ data }) => {
      setVehicles((data as Vehicle[]) ?? [])
      setLoading(false)
    })
  }, [ids])

  return (
    <div className="container-x py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Compare Vehicles</h1>
        {vehicles.length > 0 && <button onClick={clear} className="text-sm text-steel hover:text-white">Clear all</button>}
      </div>

      {loading && <div className="text-steel text-sm">Loading…</div>}
      {!loading && vehicles.length === 0 && (
        <div className="card-surface p-16 text-center">
          <p className="text-steel">Add up to 3 vehicles from any listing to compare them side by side.</p>
          <Link to="/inventory" className="btn-primary inline-block mt-4">Browse Inventory</Link>
        </div>
      )}

      {vehicles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="text-left text-steel text-xs font-normal p-3 w-40"></th>
                {vehicles.map((v) => (
                  <th key={v.id} className="p-3 text-left">
                    <img src={v.vehicle_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80'} alt="" className="w-full aspect-[4/3] object-cover rounded-sm mb-2" />
                    <div className="font-display font-semibold">{v.year} {v.make} {v.model}</div>
                    <button onClick={() => toggle(v.id)} className="text-xs text-oxblood2 mt-1">Remove</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-t border-white/[0.06]">
                  <td className="p-3 text-steel text-xs">{row.label}</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3 text-sm">{typeof row.key === 'function' ? row.key(v) : String(v[row.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
