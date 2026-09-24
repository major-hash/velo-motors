import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/inventory', label: 'Inventory' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/sell-your-car', label: 'Sell Your Car' },
]

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-obsidian/90 backdrop-blur border-b border-white/[0.06]">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-oxblood inline-block rotate-45" />
          VELO MOTORS
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white' : 'text-steel'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/favorites" aria-label="Favorites" className="text-steel hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7.5-4.9-10.1-9.3C.3 8.6 1.7 5 5.2 4.2 7.4 3.7 9.6 4.7 12 7.3c2.4-2.6 4.6-3.6 6.8-3.1 3.5.8 4.9 4.4 3.3 7.5C19.5 16.1 12 21 12 21Z"/></svg>
          </Link>
          <ThemeToggle />
          {!user && (
            <>
              <Link to="/login" className="text-sm text-steel hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Create Account</Link>
            </>
          )}
          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm">
                <span className="w-8 h-8 rounded-full bg-charcoal2 flex items-center justify-center text-xs font-medium">
                  {(profile?.full_name || 'U').slice(0, 1).toUpperCase()}
                </span>
              </button>
              <div className="absolute right-0 top-10 w-48 bg-charcoal2 border border-white/10 rounded-sm py-2 hidden group-hover:block">
                <Link to="/account" className="block px-4 py-2 text-sm text-steel hover:text-white">My Account</Link>
                {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm text-steel hover:text-white">Admin Dashboard</Link>}
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-steel hover:text-white">Logout</button>
              </div>
            </div>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/[0.06] bg-obsidian fade-in">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2.5 text-sm text-steel border-b border-white/[0.05]">{l.label}</Link>
            ))}
            <Link to="/favorites" onClick={() => setOpen(false)} className="py-2.5 text-sm text-steel border-b border-white/[0.05]">Favorites</Link>
            {!user ? (
              <div className="flex gap-3 mt-4">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1 text-center">Create Account</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-3">
                <Link to="/account" onClick={() => setOpen(false)} className="py-2.5 text-sm text-steel">My Account</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-2.5 text-sm text-steel">Admin Dashboard</Link>}
                <button onClick={handleSignOut} className="py-2.5 text-sm text-left text-steel">Logout</button>
              </div>
            )}
            <div className="mt-4"><ThemeToggle /></div>
          </div>
        </div>
      )}
    </header>
  )
}
