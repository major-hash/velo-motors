import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { TestDriveRequest, RequestStatus } from '../../types'

export default function AdminTestDrives() {
  const [rows, setRows] = useState<TestDriveRequest[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('test_drive_requests').select('*, vehicles(*), profiles(*)').order('created_at', { ascending: false })
    setRows((data as any) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: RequestStatus) {
    await supabase.from('test_drive_requests').update({ status }).eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Test Drive Requests</h1>
      {loading ? <div className="text-steel text-sm">Loading…</div> : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.id} className="card-surface p-5 grid sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <div className="font-medium">{r.vehicles ? `${r.vehicles.year} ${r.vehicles.make} ${r.vehicles.model}` : 'Vehicle'}</div>
                <div className="text-steel text-sm mt-1">{r.full_name} · {r.email} · {r.phone}</div>
                <div className="text-steel text-sm">{r.preferred_date} at {r.preferred_time}</div>
                {r.message && <div className="text-steel text-sm mt-1">"{r.message}"</div>}
                <div className="text-steel text-xs mt-1">Requested {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as RequestStatus)} className="input-field h-fit">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
          {rows.length === 0 && <div className="card-surface p-8 text-center text-steel">No test drive requests yet.</div>}
        </div>
      )}
    </div>
  )
}
