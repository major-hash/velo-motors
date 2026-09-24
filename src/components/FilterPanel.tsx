import type { VehicleFilters } from '../hooks/useVehicles'

const BODY_TYPES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Minivan']
const FUEL_TYPES = ['Gasoline', 'Hybrid', 'Electric', 'Diesel']
const TRANSMISSIONS = ['Automatic', 'Manual']
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD']
const CONDITIONS = ['New', 'Used', 'Certified Pre-Owned']

interface Props {
  filters: VehicleFilters
  onChange: (f: VehicleFilters) => void
  makes: string[]
}

export default function FilterPanel({ filters, onChange, makes }: Props) {
  function set<K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) {
    onChange({ ...filters, [key]: value, page: 1 })
  }

  function clearAll() {
    onChange({ page: 1, pageSize: filters.pageSize, sort: filters.sort })
  }

  return (
    <div className="card-surface p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold">Filters</h3>
        <button onClick={clearAll} className="text-xs text-oxblood2 hover:underline">Clear Filters</button>
      </div>

      <label className="block">
        <span className="text-xs text-steel">Make</span>
        <select className="input-field mt-1.5" value={filters.make ?? ''} onChange={(e) => set('make', e.target.value || undefined)}>
          <option value="">Any make</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-steel">Body type</span>
        <select className="input-field mt-1.5" value={filters.bodyType ?? ''} onChange={(e) => set('bodyType', e.target.value || undefined)}>
          <option value="">Any body type</option>
          {BODY_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-steel">Min price</span>
          <input type="number" className="input-field mt-1.5" value={filters.minPrice ?? ''} onChange={(e) => set('minPrice', e.target.value ? Number(e.target.value) : undefined)} />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Max price</span>
          <input type="number" className="input-field mt-1.5" value={filters.maxPrice ?? ''} onChange={(e) => set('maxPrice', e.target.value ? Number(e.target.value) : undefined)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-steel">Min year</span>
          <input type="number" className="input-field mt-1.5" value={filters.minYear ?? ''} onChange={(e) => set('minYear', e.target.value ? Number(e.target.value) : undefined)} />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Max year</span>
          <input type="number" className="input-field mt-1.5" value={filters.maxYear ?? ''} onChange={(e) => set('maxYear', e.target.value ? Number(e.target.value) : undefined)} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-steel">Fuel type</span>
        <select className="input-field mt-1.5" value={filters.fuelType ?? ''} onChange={(e) => set('fuelType', e.target.value || undefined)}>
          <option value="">Any fuel type</option>
          {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-steel">Transmission</span>
        <select className="input-field mt-1.5" value={filters.transmission ?? ''} onChange={(e) => set('transmission', e.target.value || undefined)}>
          <option value="">Any transmission</option>
          {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-steel">Drivetrain</span>
        <select className="input-field mt-1.5" value={filters.drivetrain ?? ''} onChange={(e) => set('drivetrain', e.target.value || undefined)}>
          <option value="">Any drivetrain</option>
          {DRIVETRAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-steel">Condition</span>
        <select className="input-field mt-1.5" value={filters.condition ?? ''} onChange={(e) => set('condition', e.target.value || undefined)}>
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
    </div>
  )
}
