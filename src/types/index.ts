export type Role = 'customer' | 'admin'
export type VehicleStatus = 'available' | 'reserved' | 'sold'
export type RequestStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type InquiryStatus = 'new' | 'contacted' | 'resolved'
export type SellStatus = 'new' | 'reviewing' | 'contacted' | 'completed' | 'declined'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: Role
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  trim: string | null
  price: number
  mileage: number
  condition: string
  body_type: string
  fuel_type: string
  transmission: string
  drivetrain: string
  engine: string | null
  horsepower: number | null
  exterior_color: string
  interior_color: string | null
  description: string | null
  stock_number: string
  vin: string
  status: VehicleStatus
  featured: boolean
  features: Record<string, string[]> | null
  created_at: string
  updated_at: string
  vehicle_images?: VehicleImage[]
}

export interface VehicleImage {
  id: string
  vehicle_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  vehicle_id: string
  created_at: string
  vehicles?: Vehicle
}

export interface TestDriveRequest {
  id: string
  user_id: string
  vehicle_id: string
  full_name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: RequestStatus
  created_at: string
  vehicles?: Vehicle
  profiles?: Profile
}

export interface Inquiry {
  id: string
  user_id: string | null
  vehicle_id: string | null
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: InquiryStatus
  created_at: string
  vehicles?: Vehicle
}

export interface SellRequest {
  id: string
  user_id: string | null
  full_name: string
  email: string
  phone: string
  make: string
  model: string
  year: number
  mileage: number
  condition: string
  asking_price: number
  location: string
  description: string | null
  status: SellStatus
  created_at: string
}
