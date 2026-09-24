import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'

export default function ComparisonBar() {
  const { ids, clear } = useCompare()
  if (ids.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal2 border-t border-white/10 fade-in">
      <div className="container-x py-3 flex items-center justify-between">
        <span className="text-sm text-steel">{ids.length} of 3 vehicles selected to compare</span>
        <div className="flex gap-3">
          <button onClick={clear} className="text-sm text-steel hover:text-white">Clear</button>
          <Link to="/compare" className="btn-primary text-sm">Compare Now</Link>
        </div>
      </div>
    </div>
  )
}
