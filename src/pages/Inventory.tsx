import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useVehicles, VehicleFilters } from '../hooks/useVehicles'
import FilterPanel from '../components/FilterPanel'
import VehicleCard from '../components/VehicleCard'

const PAGE_SIZE = 12

export default function Inventory() {
  const [params, setParams] = useSearchParams()
  const [makes, setMakes] = useState<string[]>([])
  const [filters, setFilters] = useState<VehicleFilters>(() => ({
    make: params.get('make') || undefined,
    model: params.get('model') || undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    minYear: params.get('minYear') ? Number(params.get('minYear')) : undefined,
    bodyType: params.get('bodyType') || undefined,
    sort: 'newest',
    page: 1,
    pageSize: PAGE_SIZE,
  }))
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('vehicles').select('make').neq('status', 'sold').then(({ data }) => {
      const unique = [...new Set((data ?? []).map((d: any) => d.make))].sort()
      setMakes(unique)
    })
  }, [])

  const activeFilters = useMemo(() => ({ ...filters, search: search || undefined }), [filters, search])
  const { vehicles, count, loading, error } = useVehicles(activeFilters)

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="container-x py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Inventory</h1>
          <p className="text-steel text-sm mt-1.5">
            {loading ? 'Loading vehicles…' : `Showing ${vehicles.length} of ${count} vehicles`}
          </p>
        </div>
        <div className="flex gap-3">
          <input
            placeholder="Search make, model, stock #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-64"
          />
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as VehicleFilters['sort'], page: 1 })}
            className="input-field w-48"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="mileage_asc">Lowest Mileage</option>
            <option value="year_desc">Newest Year</option>
            <option value="year_asc">Oldest Year</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        <FilterPanel filters={filters} onChange={setFilters} makes={makes} />

        <div>
          {error && <div className="text-oxblood2 text-sm mb-4">{error}</div>}
          {!loading && vehicles.length === 0 && !error && (
            <div className="card-surface p-16 text-center">
              <p className="text-steel">No vehicles found.</p>
              <button onClick={() => { setFilters({ sort: 'newest', page: 1, pageSize: PAGE_SIZE }); setSearch('') }} className="btn-outline mt-4">
                Clear Filters
              </button>
            </div>
          )}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters({ ...filters, page: p })}
                  className={`w-9 h-9 rounded-sm text-sm ${filters.page === p ? 'bg-oxblood text-white' : 'text-steel hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
