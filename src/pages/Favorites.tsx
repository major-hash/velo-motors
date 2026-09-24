import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Favorite } from '../types'
import VehicleCard from '../components/VehicleCard'
import { useCompare } from '../context/CompareContext'

export default function Favorites() {
  const { user } = useAuth()
  const { toggle, isIn } = useCompare()
  const [favs, setFavs] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('favorites').select('*, vehicles(*, vehicle_images(*))').eq('user_id', user!.id)
    setFavs((data as any) ?? [])
    setLoading(false)
  }

  async function remove(vehicleId: string) {
    await supabase.from('favorites').delete().eq('user_id', user!.id).eq('vehicle_id', vehicleId)
    load()
  }

  return (
    <div className="container-x py-12">
      <h1 className="font-display text-3xl font-bold mb-8">My Favorites</h1>

      {loading && <div className="text-steel text-sm">Loading…</div>}
      {!loading && favs.length === 0 && (
        <div className="card-surface p-16 text-center">
          <p className="text-steel">You haven't saved any vehicles yet.</p>
          <Link to="/inventory" className="btn-primary inline-block mt-4">Browse Inventory</Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favs.filter((f) => f.vehicles).map((f) => (
          <div key={f.id} className="relative">
            <VehicleCard vehicle={f.vehicles!} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => remove(f.vehicle_id)} className="text-xs text-steel hover:text-oxblood2">Remove favorite</button>
              <span className="text-steel text-xs">·</span>
              <button onClick={() => toggle(f.vehicle_id)} className="text-xs text-steel hover:text-white">
                {isIn(f.vehicle_id) ? '✓ In comparison' : 'Compare'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
