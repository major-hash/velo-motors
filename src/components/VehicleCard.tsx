import { Link } from 'react-router-dom'
import type { Vehicle } from '../types'
import FavoriteButton from './FavoriteButton'

function money(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const img = vehicle.vehicle_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'

  return (
    <Link to={`/vehicle/${vehicle.id}`} className="card-surface overflow-hidden group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal2">
        <img
          src={img}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        {vehicle.status !== 'available' && (
          <span className="absolute top-3 left-3 bg-oxblood text-white text-xs font-medium px-2.5 py-1 rounded-sm uppercase">
            {vehicle.status}
          </span>
        )}
        <div className="absolute top-3 right-3">
          <FavoriteButton vehicleId={vehicle.id} />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-platinum">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h3>
        <p className="text-steel text-sm mt-1">
          {vehicle.mileage.toLocaleString()} mi · {vehicle.fuel_type} · {vehicle.transmission}
        </p>
        <div className="flex items-baseline justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <span className="font-display text-xl font-semibold text-platinum">{money(vehicle.price)}</span>
          <span className="text-oxblood2 text-sm font-medium">View details</span>
        </div>
      </div>
    </Link>
  )
}
