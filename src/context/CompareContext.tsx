import { createContext, useContext, useState, ReactNode } from 'react'

interface CompareCtx {
  ids: string[]
  toggle: (id: string) => void
  clear: () => void
  isIn: (id: string) => boolean
}
const CompareContext = createContext<CompareCtx | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('velo-compare') || '[]') } catch { return [] }
  })

  function persist(next: string[]) {
    setIds(next)
    sessionStorage.setItem('velo-compare', JSON.stringify(next))
  }

  function toggle(id: string) {
    if (ids.includes(id)) {
      persist(ids.filter((x) => x !== id))
    } else if (ids.length < 3) {
      persist([...ids, id])
    }
  }

  function clear() { persist([]) }
  function isIn(id: string) { return ids.includes(id) }

  return <CompareContext.Provider value={{ ids, toggle, clear, isIn }}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
