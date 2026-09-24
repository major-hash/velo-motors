import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Stats {
  totalVehicles: number; available: number; reserved: number; sold: number
  totalCustomers: number; newInquiries: number; testDrives: number; sellRequests: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const [v, avail, res, sold, cust, inq, td, sell, recentInq] = await Promise.all([
        supabase.from('vehicles').select('id', { count: 'exact', head: true }),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'reserved'),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('test_drive_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('sell_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        totalVehicles: v.count ?? 0, available: avail.count ?? 0, reserved: res.count ?? 0, sold: sold.count ?? 0,
        totalCustomers: cust.count ?? 0, newInquiries: inq.count ?? 0, testDrives: td.count ?? 0, sellRequests: sell.count ?? 0,
      })
      setRecent(recentInq.data ?? [])
    }
    load()
  }, [])

  if (!stats) return <div className="text-steel text-sm">Loading dashboard…</div>

  const cards = [
    { label: 'Total Vehicles', value: stats.totalVehicles },
    { label: 'Available', value: stats.available },
    { label: 'Reserved', value: stats.reserved },
    { label: 'Sold', value: stats.sold },
    { label: 'Total Customers', value: stats.totalCustomers },
    { label: 'New Inquiries', value: stats.newInquiries },
    { label: 'Pending Test Drives', value: stats.testDrives },
    { label: 'New Sell Requests', value: stats.sellRequests },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <div className="text-steel text-xs">{c.label}</div>
            <div className="font-display text-3xl font-bold mt-1.5">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold mb-4">Recent inquiries</h2>
        <div className="flex flex-col gap-2">
          {recent.length === 0 && <div className="text-steel text-sm">No recent activity.</div>}
          {recent.map((r) => (
            <div key={r.id} className="card-surface p-4 flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{r.name}</span>
                <span className="text-steel ml-2">{r.subject}</span>
              </div>
              <span className="text-steel text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
