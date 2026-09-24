import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types'

export default function AdminCustomers() {
  const [rows, setRows] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as Profile[]) ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Customers</h1>
      {loading ? <div className="text-steel text-sm">Loading…</div> : (
        <div className="overflow-x-auto card-surface">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="text-left text-steel text-xs border-b border-white/10">
                <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th>
                <th className="p-3">Registered</th><th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.06]">
                  <td className="p-3">{p.full_name}</td>
                  <td className="p-3 text-steel">{p.email}</td>
                  <td className="p-3 text-steel">{p.phone || '—'}</td>
                  <td className="p-3 text-steel text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{p.role}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-steel">No customers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-steel mt-4">To promote a customer to admin, run the SQL snippet in the README against your Supabase project — this cannot be done from the UI for security.</p>
    </div>
  )
}
