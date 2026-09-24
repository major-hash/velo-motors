import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/vehicles', label: 'Vehicles' },
  { to: '/admin/vehicles/new', label: 'Add Vehicle' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/test-drives', label: 'Test Drives' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/sell-requests', label: 'Sell Requests' },
]

export default function AdminLayout() {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  async function logout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="container-x py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside>
        <div className="text-xs text-steel uppercase tracking-wide mb-3">Admin · {profile?.full_name}</div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `px-4 py-2.5 rounded-sm text-sm whitespace-nowrap ${isActive ? 'bg-charcoal2 text-white' : 'text-steel hover:text-white'}`}
            >
              {l.label}
            </NavLink>
          ))}
          <button onClick={logout} className="text-left px-4 py-2.5 rounded-sm text-sm text-steel hover:text-white mt-4 border-t border-white/10 pt-4">
            Logout
          </button>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
