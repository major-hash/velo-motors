import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Vehicle } from '../types'

export interface VehicleFilters {
  search?: string
  make?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  bodyType?: string
  fuelType?: string
  transmission?: string
  drivetrain?: string
  condition?: string
  status?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'year_desc' | 'year_asc'
  page?: number
  pageSize?: number
}

export function useVehicles(filters: VehicleFilters) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = filters.page ?? 1
      const pageSize = filters.pageSize ?? 12
      let query = supabase
        .from('vehicles')
        .select('*, vehicle_images(*)', { count: 'exact' })

      if (!filters.status) {
        query = query.neq('status', 'sold')
      } else {
        query = query.eq('status', filters.status)
      }
      if (filters.search) {
        const s = filters.search.trim()
        query = query.or(
          `make.ilike.%${s}%,model.ilike.%${s}%,stock_number.ilike.%${s}%`
        )
      }
      if (filters.make) query = query.eq('make', filters.make)
      if (filters.model) query = query.eq('model', filters.model)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.minYear) query = query.gte('year', filters.minYear)
      if (filters.maxYear) query = query.lte('year', filters.maxYear)
      if (filters.bodyType) query = query.eq('body_type', filters.bodyType)
      if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType)
      if (filters.transmission) query = query.eq('transmission', filters.transmission)
      if (filters.drivetrain) query = query.eq('drivetrain', filters.drivetrain)
      if (filters.condition) query = query.eq('condition', filters.condition)

      switch (filters.sort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'mileage_asc': query = query.order('mileage', { ascending: true }); break
        case 'year_desc': query = query.order('year', { ascending: false }); break
        case 'year_asc': query = query.order('year', { ascending: true }); break
        default: query = query.order('created_at', { ascending: false })
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error
      setVehicles((data as Vehicle[]) ?? [])
      setCount(count ?? 0)
    } catch (e: any) {
      setError('Something went wrong loading vehicles. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  return { vehicles, count, loading, error, refetch: fetchVehicles }
}
