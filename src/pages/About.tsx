export default function About() {
  return (
    <div>
      <div className="container-x py-16">
        <h1 className="font-display text-4xl font-bold max-w-xl">Built by people who'd rather sell you the truth than the upsell.</h1>

        <div className="grid md:grid-cols-3 gap-10 mt-14">
          <div>
            <h3 className="font-display text-lg font-semibold text-oxblood2">Our Story</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">Velo Motors started as a single lot with a simple idea: price the car right the first time, and skip the back-and-forth. That idea is still the whole business.</p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-oxblood2">Our Mission</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">Make buying a used car feel as straightforward as buying anything else — clear pricing, real inspection reports, no pressure.</p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-oxblood2">Our Values</h3>
            <p className="text-steel text-sm mt-2 leading-relaxed">Transparency over persuasion. Every car's history and inspection report is available before you ask for it.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 border-t border-white/10 pt-10">
          <Stat n="500+" l="Vehicles Sold" />
          <Stat n="1,200+" l="Customers" />
          <Stat n="10+" l="Years Experience" />
        </div>

        <div className="mt-16">
          <h3 className="font-display text-lg font-semibold">Why Choose Velo Motors</h3>
          <ul className="text-steel text-sm mt-3 space-y-2 max-w-md leading-relaxed list-disc list-inside">
            <li>110-point inspection on every vehicle</li>
            <li>Transparent, no-haggle pricing</li>
            <li>In-house financing estimates before you apply</li>
            <li>Same-day paperwork on most purchases</li>
          </ul>
        </div>

        <div className="mt-16">
          <h3 className="font-display text-lg font-semibold mb-4">Our Team</h3>
          <p className="text-steel text-sm max-w-lg leading-relaxed">Placeholder — add real team bios and photos here once available.</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-bold">{n}</div>
      <div className="text-steel text-sm mt-1">{l}</div>
    </div>
  )
}
