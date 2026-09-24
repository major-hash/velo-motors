import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Vehicle } from '../types'
import VehicleCard from '../components/VehicleCard'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ make: '', model: '', minPrice: '', maxPrice: '', year: '', bodyType: '' })

  useEffect(() => {
    supabase
      .from('vehicles')
      .select('*, vehicle_images(*)')
      .eq('featured', true)
      .neq('status', 'sold')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setFeatured((data as Vehicle[]) ?? [])
        setLoading(false)
      })
  }, [])

  function runSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.make) params.set('make', search.make)
    if (search.model) params.set('model', search.model)
    if (search.minPrice) params.set('minPrice', search.minPrice)
    if (search.maxPrice) params.set('maxPrice', search.maxPrice)
    if (search.year) params.set('minYear', search.year)
    if (search.bodyType) params.set('bodyType', search.bodyType)
    navigate(`/inventory?${params.toString()}`)
  }

  return (
    <div>
      <section className="relative border-b border-white/[0.06]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.28]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
        </div>
        <div className="container-x relative py-28 md:py-36">
          <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.02] max-w-2xl">
            Find the Car That Fits Your Life.
          </h1>
          <p className="text-steel text-base md:text-lg mt-5 max-w-lg leading-relaxed">
            Discover quality vehicles, explore your options, and drive away with confidence.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/inventory" className="btn-primary">Browse Inventory</Link>
            <Link to="/sell-your-car" className="btn-outline">Sell Your Car</Link>
          </div>

          <form onSubmit={runSearch} className="mt-14 card-surface bg-charcoal/80 backdrop-blur p-5 grid md:grid-cols-6 gap-3">
            <input placeholder="Make" value={search.make} onChange={(e) => setSearch({ ...search, make: e.target.value })} className="input-field md:col-span-1" />
            <input placeholder="Model" value={search.model} onChange={(e) => setSearch({ ...search, model: e.target.value })} className="input-field md:col-span-1" />
            <input placeholder="Min price" type="number" value={search.minPrice} onChange={(e) => setSearch({ ...search, minPrice: e.target.value })} className="input-field md:col-span-1" />
            <input placeholder="Max price" type="number" value={search.maxPrice} onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })} className="input-field md:col-span-1" />
            <input placeholder="Year" type="number" value={search.year} onChange={(e) => setSearch({ ...search, year: e.target.value })} className="input-field md:col-span-1" />
            <button className="btn-primary md:col-span-1">Search Vehicles</button>
          </form>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Featured vehicles</h2>
            <p className="text-steel text-sm mt-1.5">Hand-picked from current inventory.</p>
          </div>
          <Link to="/inventory" className="text-sm text-oxblood2 hover:underline hidden md:block">View all inventory</Link>
        </div>

        {loading && <div className="text-steel text-sm">Loading vehicles…</div>}
        {!loading && featured.length === 0 && (
          <div className="text-steel text-sm">No featured vehicles yet — mark some as featured from the admin dashboard.</div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-surface p-7">
            <div className="text-oxblood2 text-sm font-medium mb-2">Inspected</div>
            <h3 className="font-display text-xl font-semibold">110-point inspection</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">Every vehicle is checked mechanically and cosmetically before it's listed.</p>
          </div>
          <div className="card-surface p-7">
            <div className="text-oxblood2 text-sm font-medium mb-2">Transparent</div>
            <h3 className="font-display text-xl font-semibold">No hidden fees</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">The price you see on the listing is the price you pay at the counter.</p>
          </div>
          <div className="card-surface p-7">
            <div className="text-oxblood2 text-sm font-medium mb-2">Fast</div>
            <h3 className="font-display text-xl font-semibold">Same-day paperwork</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">Most buyers finish financing and drive off within a few hours.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
