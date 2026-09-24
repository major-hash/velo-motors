const SERVICES = [
  { title: 'Vehicle Financing', desc: 'We work with a network of lenders to find competitive rates across credit profiles. Use the financing calculator on any listing to estimate payments before you apply.' },
  { title: 'Trade-In', desc: 'Bring your current vehicle in for an appraisal and roll the value straight into your next purchase. Most trade-in valuations take under 30 minutes.' },
  { title: 'Vehicle Inspection', desc: 'Every car that enters our lot goes through a 110-point mechanical and cosmetic inspection before it is priced and listed.' },
  { title: 'Vehicle Maintenance', desc: 'Our service bay handles routine maintenance and repairs for vehicles purchased here, with transparent pricing on every job.' },
  { title: 'Vehicle Delivery', desc: 'Can\'t make it to the lot? We deliver purchased vehicles within a set radius and can arrange shipping further out.' },
  { title: 'Vehicle Sourcing', desc: 'Looking for something specific that\'s not currently on the lot? Tell us the make, model, and budget, and we\'ll search our network.' },
]

export default function Services() {
  return (
    <div className="container-x py-16">
      <h1 className="font-display text-4xl font-bold max-w-xl">Services built around the whole buying process.</h1>
      <p className="text-steel mt-3 max-w-lg">From financing to delivery, here's what's included when you buy from Velo Motors.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        {SERVICES.map((s) => (
          <div key={s.title} className="card-surface p-7">
            <h3 className="font-display text-xl font-semibold">{s.title}</h3>
            <p className="text-steel text-sm mt-2.5 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
