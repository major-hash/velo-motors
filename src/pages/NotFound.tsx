import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <div className="font-display text-6xl font-bold text-steel">404</div>
      <p className="text-steel mt-4">That page doesn't exist.</p>
      <Link to="/" className="btn-primary inline-block mt-6">Back home</Link>
    </div>
  )
}
