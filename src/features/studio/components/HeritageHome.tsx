'use client'

import Image from 'next/image'
import { ArrowRight, BookOpen, Check, Flower2, Heart, Palette, Search, Shirt } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
import { EmptyState } from '../../../components/ui'
import { categories, featuredGarments, filterGarments, garmentById, garments, occasions, outfitName, paletteLooks, palettes, steps } from '../data'
import type { Garment, Outfit, SavedOutfit, StepId } from '../data'
import { GarmentArtwork, IllustrationThumbnail } from './IllustrationThumbnail'
import { OccasionSymbol } from './WardrobeSymbols'

type Props = {
  outfit: Outfit; saved: SavedOutfit[]; query: string; category: string; preview: ReactNode;
  collectionRef: RefObject<HTMLElement | null>; occasionRef: RefObject<HTMLElement | null>;
  setQuery: (value: string) => void; setCategory: (value: string) => void;
  selectGarment: (garment: Garment, open?: boolean) => void; changeOutfit: (patch: Partial<Outfit>) => void;
  openBuilder: (step?: StepId) => void; openStory: () => void; openHeritage: () => void;
  openCollection: () => void; openResult: () => void; saveOutfit: () => void;
}

export default function HeritageHome(props: Props) {
  const { outfit, saved, query, category, preview, collectionRef, occasionRef, setQuery, setCategory, selectGarment, changeOutfit, openBuilder, openStory, openHeritage, openCollection, openResult, saveOutfit } = props
  const palette = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  const garment = garmentById(outfit.garmentId)
  const occasion = occasions.find(o => o.id === outfit.occasionId) ?? occasions[2]
  const filtered = filterGarments(query, query.trim() ? 'Tất cả' : category)
  const families = featuredGarments.map(g => g.category)
  const explored = [...new Set(saved.map(s => garmentById(s.garmentId).category).filter(c => families.includes(c)))]

  return <main className="vietnam-page">
    <section className="heritage-cover" aria-labelledby="hero-title">
      <div className="cover-copy">
        <p className="vietnam-eyebrow"><Flower2 size={17} /> VIỆT PHỤC & ĐỜI SỐNG</p>
        <h1 id="hero-title">Tủ đồ di sản.<br /><em>Sắc Việt của tôi.</em></h1>
        <p className="cover-description">Từ một nếp áo xưa, tìm thấy mình hôm nay. Khám phá dáng áo Việt, chọn sắc màu yêu thích và lưu lại những bản phối của riêng bạn.</p>
        <div className="cover-actions"><button className="button button-red" onClick={() => openBuilder()}><Shirt size={18} />Bắt đầu phối đồ<ArrowRight size={17} /></button><button className="text-button" onClick={openStory}>Câu chuyện nếp áo<BookOpen size={17} /></button></div>
        <div className="cover-caption"><span className="cloth-buttons" aria-hidden="true"><i /><i /><i /><i /><i /></span><p>Nếp áo thân quen.<br /><strong>Một cách mới để gần di sản.</strong></p></div>
      </div>
      <figure className="cover-photo"><Image src="/visuals/vietnam-heritage.png" alt="Minh họa đôi bạn mặc áo ngũ thân đỏ son và xanh ngọc bên hiên nhà truyền thống Huế" fill sizes="(max-width: 760px) 100vw, 60vw" preload /><figcaption><span>NHỮNG NẾP ÁO VIỆT</span><strong>Gặp nhau bên hiên nhà.</strong><small>Ảnh minh họa sáng tạo</small></figcaption></figure>
    </section>

    <div className="heritage-values">
      <button onClick={openHeritage}><BookOpen size={20} /><span>Tìm hiểu gốc áo<small>Câu chuyện & tư liệu Việt phục</small></span><ArrowRight size={16} /></button>
      <button onClick={() => openBuilder('color')}><Palette size={20} /><span>Phối sắc của mình<small>Chọn màu, chọn dịp, chọn phong cách</small></span><ArrowRight size={16} /></button>
      <button onClick={openCollection}><Heart size={20} /><span>Giữ lại điều mình thích<small>{saved.length} bản phối trong tủ đồ của bạn</small></span><ArrowRight size={16} /></button>
    </div>

    <div className="wardrobe-layout">
      <section ref={collectionRef} className="vietnam-wardrobe" aria-labelledby="clothing-title">
        <div className="wardrobe-heading"><div><p className="vietnam-eyebrow">MỞ TỦ ĐỒ</p><h2 id="clothing-title">{query.trim() ? 'Dáng áo bạn đang tìm' : category === 'Bình dân' ? 'Nếp áo đời thường thời Nguyễn' : 'Chọn một dáng áo Việt'}</h2></div><span className="catalog-count">{garments.length} mẫu minh họa</span></div>
        {category === 'Bình dân' && !query.trim() && <p className="commoner-intro">Áo ngũ thân tay chẽn, tứ thân Bắc Bộ, khăn vải và sắc trầm. Bốn minh họa mới tham khảo phom áo trong tư liệu, với tạo hình chibi của studio.</p>}
        <form className="wardrobe-search" role="search" onSubmit={event => event.preventDefault()}><Search size={18} /><input aria-label="Tìm trong tủ đồ di sản" type="search" placeholder="Tìm áo ngũ thân, nhật bình, mã mẫu…" value={query} onChange={event => setQuery(event.target.value)} /></form>
        <div className="wardrobe-filters" aria-label="Loại trang phục">{categories.map(c => <button key={c} aria-pressed={category === c && !query.trim()} onClick={() => { setQuery(''); setCategory(c) }}>{c}</button>)}</div>
        <div className="vietnam-garment-grid">{filtered.map(g => <button key={g.id} className="vietnam-garment" aria-label={`Phối ${g.name}`} aria-pressed={outfit.garmentId === g.id} onClick={() => selectGarment(g, true)}><div className="vietnam-garment-picture"><GarmentArtwork garment={g} /><span className="garment-origin">{g.folk ? 'Bình dân · Thời Nguyễn' : g.royal ? 'Cung đình · Concept' : 'Cảm hứng Việt phục'}</span>{outfit.garmentId === g.id && <span className="garment-current"><Check size={13} />Đang phối</span>}</div><div className="vietnam-garment-info"><small>{g.subtitle}</small><h3>{g.name}</h3><span>Thử bản phối<ArrowRight size={15} /></span></div></button>)}</div>
        {filtered.length === 0 && <EmptyState title="Chưa tìm thấy dáng áo này" description="Bạn có thể thử tên không dấu hoặc mã mẫu, chẳng hạn P07."><button className="text-button" onClick={() => { setQuery(''); setCategory('Tất cả') }}>Xem lại tủ đồ<ArrowRight size={16} /></button></EmptyState>}
      </section>

      <aside className="wardrobe-journal">
        <section className="my-wardrobe-note"><div className="journal-heading"><BookOpen size={20} /><h2>Tủ đồ của tôi</h2></div><p>Mỗi bản phối đã lưu là một dấu nhỏ trong hành trình tìm sắc riêng.</p><div className="wardrobe-progress"><span>{explored.length} / {families.length} dáng áo đã lưu</span><span>{Math.round(explored.length / families.length * 100)}%</span></div><progress value={explored.length} max={families.length} aria-label="Số dáng áo Việt đã có bản phối được lưu" /><div className="family-list">{families.map(f => <span key={f} className={explored.includes(f) ? 'explored' : ''}>{explored.includes(f) ? <Check size={13} /> : <Shirt size={13} />}{f}</span>)}</div><button className="text-button" onClick={openCollection}>Mở tủ đồ của tôi<ArrowRight size={16} /></button></section>
        <section className="vietnam-journal"><Flower2 size={31} strokeWidth={1.2} /><p className="vietnam-eyebrow">CHUYỆN NẾP ÁO</p><h2>Gần di sản,<br />từ điều thân quen.</h2><p>Áo ngũ thân, áo tứ thân, áo dài, nhật bình. Những tên gọi mở ra nhiều câu chuyện để mình cùng tìm hiểu.</p><button className="text-button" onClick={openHeritage}>Đọc chuyện Việt phục<ArrowRight size={16} /></button></section>
      </aside>
    </div>

    <section className="live-workbench" aria-labelledby="workbench-title"><div className="workbench-preview" aria-label="Bản phối trực tiếp">{preview}</div><div className="workbench-copy"><p className="vietnam-eyebrow">GÓC PHỐI ĐỒ CỦA BẠN</p><h2 id="workbench-title">{outfitName(outfit)}</h2><p>{garment.subtitle}</p><dl><div><dt>Sắc màu</dt><dd><i style={{ background: palette.colors[0] }} />{palette.name}</dd></div><div><dt>Dịp mặc</dt><dd>{occasion.shortName}</dd></div><div><dt>Phong cách</dt><dd>{outfit.style}</dd></div></dl><div className="workbench-actions"><button className="button button-red" onClick={openResult}>Xem bản phối<ArrowRight size={16} /></button><button className="icon-button" aria-label="Lưu bản phối hiện tại" onClick={saveOutfit}><Heart size={18} /></button></div></div><div className="workbench-steps"><h3>Thêm một chút sắc riêng</h3>{steps.map(s => <button key={s.id} onClick={() => openBuilder(s.id)}><span>{s.label}</span><ArrowRight size={16} /></button>)}</div></section>

    <section className="vietnam-colors" aria-labelledby="color-title"><div className="wardrobe-heading"><div><p className="vietnam-eyebrow">SẮC MÀU QUEN THUỘC</p><h2 id="color-title">Một dáng áo, nhiều sắc riêng</h2></div><button className="text-button" onClick={() => openBuilder('color')}>Xem bảng màu<ArrowRight size={16} /></button></div><div className="vietnam-palette-grid">{paletteLooks.map(id => { const p = palettes.find(p => p.id === id)!; return <button key={id} aria-pressed={outfit.colorId === id} onClick={() => changeOutfit({ colorId: id })}><IllustrationThumbnail selection={{ garmentId: outfit.garmentId, colorId: id }} /><div><span className="vietnam-color-dots">{p.colors.map(c => <i key={c} style={{ background: c }} />)}</span><h3>{p.name}</h3><p>{p.meaning}</p>{outfit.colorId === id && <small><Check size={13} />Đang chọn</small>}</div></button> })}</div></section>

    <section ref={occasionRef} className="vietnam-occasions" aria-labelledby="event-title"><div className="wardrobe-heading"><div><p className="vietnam-eyebrow">MẶC ĐỂ GẶP NHAU</p><h2 id="event-title">Hôm nay, mình đi đâu?</h2></div><p>Một nếp áo đẹp cho mỗi cuộc hẹn.</p></div><div className="vietnam-occasion-grid">{occasions.map(o => <button key={o.id} aria-pressed={outfit.occasionId === o.id} onClick={() => { changeOutfit({ occasionId: o.id }); openBuilder('occasion') }}><OccasionSymbol id={o.id} size={26} /><span>{o.shortName}</span><ArrowRight size={15} /></button>)}</div></section>

    <footer className="vietnam-footer"><div><strong>RE:SẮC STUDIO</strong><span>Di sản Việt. Sắc riêng mỗi ngày.</span></div><button className="text-button" onClick={openHeritage}>Có gốc để viết tiếp<BookOpen size={17} /></button><small>Minh họa sáng tạo · Trân trọng bối cảnh văn hóa</small></footer>
  </main>
}
