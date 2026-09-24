import { useMemo, useState } from 'react'

export default function FinancingCalculator({ initialPrice = 25000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice)
  const [down, setDown] = useState(Math.round(initialPrice * 0.1))
  const [term, setTerm] = useState(48)
  const [apr, setApr] = useState(7.5)

  const { payment, financed, interest } = useMemo(() => {
    const principal = Math.max(price - down, 0)
    const monthlyRate = apr / 100 / 12
    const p = monthlyRate === 0
      ? principal / term
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    const totalPaid = p * term
    return { payment: p, financed: principal, interest: Math.max(totalPaid - principal, 0) }
  }, [price, down, term, apr])

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

  return (
    <div className="grid md:grid-cols-2 gap-0 card-surface overflow-hidden">
      <div className="p-8 md:p-10 bg-charcoal2">
        <h3 className="font-display text-2xl font-semibold">Financing calculator</h3>
        <p className="text-steel text-sm mt-2 leading-relaxed max-w-xs">
          Estimate only — your real rate depends on credit and term at signing. This is not a loan offer.
        </p>
      </div>
      <div className="p-8 md:p-10 flex flex-col gap-5">
        <label className="block">
          <span className="text-xs text-steel">Vehicle price ($)</span>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input-field mt-1.5" />
        </label>
        <label className="block">
          <span className="text-xs text-steel">Down payment ($)</span>
          <input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} className="input-field mt-1.5" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-steel">Loan term</span>
            <select value={term} onChange={(e) => setTerm(Number(e.target.value))} className="input-field mt-1.5">
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
              <option value={72}>72 months</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-steel">Est. APR (%)</span>
            <input type="number" step="0.1" value={apr} onChange={(e) => setApr(Number(e.target.value))} className="input-field mt-1.5" />
          </label>
        </div>
        <div className="border-t border-white/10 pt-5 mt-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-steel">Estimated monthly payment</span>
            <span className="font-display text-3xl font-bold text-oxblood2">{fmt(payment)}</span>
          </div>
          <div className="flex justify-between text-xs text-steel"><span>Amount financed</span><span>{fmt(financed)}</span></div>
          <div className="flex justify-between text-xs text-steel"><span>Estimated interest</span><span>{fmt(interest)}</span></div>
        </div>
      </div>
    </div>
  )
}
