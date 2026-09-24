import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SellRequest, SellStatus } from '../../types'

export default function AdminSellRequests() {
  const [rows, setRows] = useState<SellRequest[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('sell_requests').select('*').order('created_at', { ascending: false })
    setRows((data as SellRequest[]) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: SellStatus) {
    await supabase.from('sell_requests').update({ status }).eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Sell Requests</h1>
      {loading ? <div className="text-steel text-sm">Loading…</div> : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.id} className="card-surface p-5 grid sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <div className="font-medium">{r.year} {r.make} {r.model} — ${r.asking_price.toLocaleString()} asking</div>
                <div className="text-steel text-sm mt-1">{r.full_name} · {r.email} · {r.phone}</div>
                <div className="text-steel text-sm">{r.mileage.toLocaleString()} mi · {r.condition} · {r.location}</div>
                {r.description && <div className="text-steel text-sm mt-1">{r.description}</div>}
                <div className="text-steel text-xs mt-1">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as SellStatus)} className="input-field h-fit">
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          ))}
          {rows.length === 0 && <div className="card-surface p-8 text-center text-steel">No sell requests yet.</div>}
        </div>
      )}
    </div>
  )
}
