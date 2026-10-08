import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { accessories, garmentById, occasions, palettes } from '../data'
import type { SavedOutfit } from '../data'

export default function OutfitComparison({ outfits, renderArt, onOpen }: { outfits: SavedOutfit[]; renderArt: (outfit: SavedOutfit) => ReactNode; onOpen: (outfit: SavedOutfit) => void }) {
  return <div className="comparison-body"><div className="comparison-grid">{outfits.map(s => <article className="comparison-card" key={s.id}><div className="comparison-image">{renderArt(s)}</div><div className="comparison-info"><h3>{s.name}</h3><p>{garmentById(s.garmentId).subtitle}</p><dl><div><dt>Bảng màu</dt><dd>{palettes.find(p => p.id === s.colorId)?.name}</dd></div><div><dt>Dịp mặc</dt><dd>{occasions.find(o => o.id === s.occasionId)?.shortName}</dd></div><div><dt>Phong cách</dt><dd>{s.style}</dd></div><div><dt>Phụ kiện</dt><dd>{accessories.filter(a => s.accessoryIds.includes(a.id)).map(a => a.name).join(' · ') || 'Chưa chọn'}</dd></div><div><dt>Ngày lưu</dt><dd>{new Date(s.createdAt).toLocaleDateString('vi-VN')}</dd></div></dl><button className="button button-gold" onClick={() => onOpen(s)}>Mở bản phối<ArrowRight size={15} /></button></div></article>)}</div><p>Hai bản phối được lấy từ tủ đồ đã lưu trên trình duyệt này. Bạn có thể đối chiếu màu sắc, phụ kiện và dịp mặc để chọn bản phù hợp.</p></div>
}
