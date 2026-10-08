import { ArrowUpRight, BookOpen } from 'lucide-react'
import type { Garment } from '../data'

export default function GarmentProvenance({ garment }: { garment: Garment }) {
  if (!garment.history) return null
  const history = garment.history
  return <section className="garment-provenance" aria-label={`Tư liệu ${garment.name}`}>
    <h4><BookOpen size={17} />Gốc áo & bối cảnh</h4>
    <p className="provenance-place">{history.region}<span>{history.period}</span></p>
    <ul>{history.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
    <div className="provenance-sources">{history.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={13} /></a>)}</div>
    <p className="provenance-note">{history.illustrationNote}</p>
  </section>
}
