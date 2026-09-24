import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading) return <div className="container-x py-24 text-center text-steel">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  // Never trust a client-side flag alone — RLS on the server enforces this for
  // real. This redirect just keeps normal customers out of the admin UI.
  if (!isAdmin && profile) return <Navigate to="/account" replace />
  return <>{children}</>
}
