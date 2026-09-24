import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Inquiry, InquiryStatus } from '../../types'

export default function AdminInquiries() {
  const [rows, setRows] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('inquiries').select('*, vehicles(*)').order('created_at', { ascending: false })
    setRows((data as any) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: InquiryStatus) {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Inquiries</h1>
      {loading ? <div className="text-steel text-sm">Loading…</div> : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.id} className="card-surface p-5 grid sm:grid-cols-[1fr_auto] gap-3">
              <div>
                <div className="font-medium">{r.subject}</div>
                <div className="text-steel text-sm mt-1">{r.name} · {r.email} {r.phone ? `· ${r.phone}` : ''}</div>
                {r.vehicles && <div className="text-steel text-sm">{r.vehicles.year} {r.vehicles.make} {r.vehicles.model}</div>}
                <div className="text-steel text-sm mt-1">{r.message}</div>
                <div className="text-steel text-xs mt-1">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as InquiryStatus)} className="input-field h-fit">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          ))}
          {rows.length === 0 && <div className="card-surface p-8 text-center text-steel">No inquiries yet.</div>}
        </div>
      )}
    </div>
  )
}
