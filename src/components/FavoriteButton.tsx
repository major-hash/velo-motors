import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function FavoriteButton({ vehicleId, className = '' }: { vehicleId: string; className?: string }) {
  const { user } = useAuth()
  const [isFav, setIsFav] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!user) { setIsFav(false); return }
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('vehicle_id', vehicleId)
      .maybeSingle()
      .then(({ data }) => setIsFav(!!data))
  }, [user, vehicleId])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setNotice('Please log in to save vehicles to your favorites.')
      setTimeout(() => setNotice(''), 3000)
      return
    }
    setBusy(true)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('vehicle_id', vehicleId)
      setIsFav(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, vehicle_id: vehicleId })
      setIsFav(true)
    }
    setBusy(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={busy}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        className={`w-9 h-9 rounded-full flex items-center justify-center bg-black/40 backdrop-blur hover:bg-black/60 transition-colors ${className}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#a52c3a' : 'none'} stroke={isFav ? '#a52c3a' : '#d8d9d6'} strokeWidth="2">
          <path d="M12 21s-7.5-4.9-10.1-9.3C.3 8.6 1.7 5 5.2 4.2 7.4 3.7 9.6 4.7 12 7.3c2.4-2.6 4.6-3.6 6.8-3.1 3.5.8 4.9 4.4 3.3 7.5C19.5 16.1 12 21 12 21Z"/>
        </svg>
      </button>
      {notice && (
        <div className="absolute right-0 top-11 w-56 bg-charcoal2 border border-white/10 text-xs text-platinum p-3 rounded-sm z-20 fade-in">
          {notice}
        </div>
      )}
    </div>
  )
}
