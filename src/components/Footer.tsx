import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-24">
      <div className="container-x py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display font-bold text-lg">VELO MOTORS</div>
          <p className="text-steel text-sm mt-3 leading-relaxed">Drive What Moves You.</p>
        </div>
        <div>
          <div className="text-xs text-steel uppercase tracking-wide mb-3">Explore</div>
          <div className="flex flex-col gap-2 text-sm text-steel">
            <Link to="/inventory" className="hover:text-white">Inventory</Link>
            <Link to="/services" className="hover:text-white">Services</Link>
            <Link to="/sell-your-car" className="hover:text-white">Sell Your Car</Link>
            <Link to="/compare" className="hover:text-white">Compare</Link>
          </div>
        </div>
        <div>
          <div className="text-xs text-steel uppercase tracking-wide mb-3">Company</div>
          <div className="flex flex-col gap-2 text-sm text-steel">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <div className="text-xs text-steel uppercase tracking-wide mb-3">Contact</div>
          <div className="flex flex-col gap-2 text-sm text-steel">
            <span>4110 Frontage Road, Your City</span>
            <span>(555) 019-2244</span>
            <span>hello@velomotors.example</span>
          </div>
        </div>
      </div>
      <div className="container-x py-6 border-t border-white/[0.06] text-xs text-steel">
        © {new Date().getFullYear()} Velo Motors. Demo inventory shown for illustration.
      </div>
    </footer>
  )
}
