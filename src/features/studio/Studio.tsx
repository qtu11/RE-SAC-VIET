'use client'

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  ArrowDownToLine, ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check,
  CircleUserRound, Flower2, Heart,
  House, Menu, Moon, Search, Share2, ShieldCheck, Shirt,
  Sparkles, Sun, Trash2, X,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { Brand, EmptyState, Modal, Toast } from '../../components/ui'
import {
  accessories, defaultOutfit, filterGarments, nguyenSources,
  garmentById, getInitialOutfit, looks, occasions,
  outfitKey, outfitName, palettes, parseOutfit, steps, styles,
} from './data'
import type { Garment, Outfit, SavedOutfit, StepId } from './data'
import { garmentProfiles } from './wardrobe'
import { GarmentArtwork, IllustrationThumbnail } from './components/IllustrationThumbnail'
import { paintThumbnail, prepareIllustration } from './illustration-renderer'
import { referenceViews } from './reference'
import HeritageHome from './components/HeritageHome'
import { AccessorySymbol, OccasionSymbol } from './components/WardrobeSymbols'
import OutfitComparison from './components/OutfitComparison'
import GarmentProvenance from './components/GarmentProvenance'

const CharacterStage = dynamic(() => import('./components/CharacterStage'), { ssr: false, loading: () => <div className="stage-loading" role="status">Đang mở nhân vật…</div> })

type ModalName = 'builder' | 'result' | 'story' | 'heritage' | 'collection' | 'compare' | 'community' | 'profile' | null

function readSaved(): SavedOutfit[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('resac-collection') ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter((v): v is SavedOutfit => !!parseOutfit(v) && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.createdAt === 'string')
  } catch { return [] }
}

function readFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('resac-favorites') ?? '[]')
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && looks.some(l => l.id === v)) : []
  } catch { return [] }
}

function FanIcon({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17a14 14 0 0 1 26 0L16 27 3 17Z" /><path d="m16 27-7-16m7 16-3-20m3 20 3-20m-3 20 7-16m-7 16 11-11m-11 11L5 16" /><path d="m15 27-1 3m3-3 1 3" /></svg>
}

function StepIcon({ step, size = 30 }: { step: StepId; size?: number }) {
  if (step === 'garment' || step === 'style') return <Shirt size={size} strokeWidth={1.45} />
  if (step === 'occasion') return <CalendarDays size={size} strokeWidth={1.45} />
  if (step === 'accessory') return <FanIcon size={size} />
  return <span className="palette-icon" aria-hidden="true"><i /><i /><i /></span>
}

const subscribeBrowserReady = () => () => {}
const browserSnapshot = () => true
const serverSnapshot = () => false

export default function Studio() {
  const ready = useSyncExternalStore(subscribeBrowserReady, browserSnapshot, serverSnapshot)
  // Prerender real page content with stable defaults, then mount the interactive
  // studio once browser preferences are available. No initial storage writes.
  return <StudioView key={ready ? 'browser' : 'server'} browserReady={ready} />
}

function StudioView({ browserReady }: { browserReady: boolean }) {
  const [outfit, setOutfit] = useState<Outfit>(() => browserReady ? getInitialOutfit() : defaultOutfit)
  const [saved, setSaved] = useState<SavedOutfit[]>(() => browserReady ? readSaved() : [])
  const savedRef = useRef(saved)
  const saving = useRef(false)
  const [favorites, setFavorites] = useState<string[]>(() => browserReady ? readFavorites() : [])
  const [modal, setModal] = useState<ModalName>(() => browserReady && new URLSearchParams(window.location.search).has('look') ? 'result' : null)
  const [step, setStep] = useState<StepId>('garment')
  const [category, setCategory] = useState('Bình dân')
  const [builderGender, setBuilderGender] = useState('Tất cả')
  const [builderScope, setBuilderScope] = useState('Tất cả')
  const [builderQuery, setBuilderQuery] = useState('')
  const [query, setQuery] = useState('')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [activeNav, setActiveNav] = useState('Tủ đồ')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [theme, setTheme] = useState<'day' | 'night'>(() => { try { return browserReady && localStorage.getItem('resac-vietnam-theme') === 'night' ? 'night' : 'day' } catch { return 'day' } })
  const [profile, setProfile] = useState(() => { try { return browserReady ? localStorage.getItem('resac-profile') ?? '' : '' } catch { return '' } })
  const [profileDraft, setProfileDraft] = useState(profile)
  const [toast, setToast] = useState('')
  const [shareLink, setShareLink] = useState('')
  const collectionRef = useRef<HTMLElement>(null)
  const occasionRef = useRef<HTMLElement>(null)
  const currentGarment = garmentById(outfit.garmentId)
  const currentPalette = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  const currentOccasion = occasions.find(o => o.id === outfit.occasionId) ?? occasions[2]
  const builderGarments = filterGarments(builderQuery, builderScope, builderGender)
  const compareOutfits = compareIds.map(id => saved.find(s => s.id === id)).filter((s): s is SavedOutfit => !!s)

  useEffect(() => { savedRef.current = saved }, [saved])

  useEffect(() => {
    if (!browserReady) return
    try { localStorage.setItem('resac-outfit', JSON.stringify(outfit)) } catch { /* The current session remains usable when storage is unavailable. */ }
  }, [outfit, browserReady])
  useEffect(() => {
    if (!browserReady) return
    try { localStorage.setItem('resac-favorites', JSON.stringify(favorites)) } catch { /* Favorites remain in memory for this session. */ }
  }, [favorites, browserReady])
  useEffect(() => {
    if (!browserReady) return
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('resac-vietnam-theme', theme) } catch { /* Theme still applies to this session. */ }
  }, [theme, browserReady])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 3600)
    return () => clearTimeout(id)
  }, [toast])

  const changeOutfit = (patch: Partial<Outfit>) => { setShareLink(''); setOutfit(previous => ({ ...previous, ...patch })) }
  const openBuilder = (nextStep: StepId = 'garment') => { setStep(nextStep); setBuilderQuery(''); setBuilderGender('Tất cả'); setBuilderScope('Tất cả'); setModal('builder'); setMobileMenu(false) }
  const openModal = (next: ModalName) => { setModal(next); setMobileMenu(false) }
  const selectGarment = (garment: Garment, open = false) => {
    changeOutfit({ garmentId: garment.id, colorId: garmentProfiles[garment.id].defaultColorId, ...(garment.folk ? { accessoryIds: ['khan', 'giay'], style: 'Cổ điển' } : {}) })
    if (open) openBuilder('garment')
  }
  const toggleAccessory = (id: string) => { setShareLink(''); setOutfit(previous => ({ ...previous, accessoryIds: previous.accessoryIds.includes(id) ? previous.accessoryIds.filter(a => a !== id) : [...previous.accessoryIds, id] })) }
  const toggleFavorite = (id: string) => {
    const removing = favorites.includes(id)
    setFavorites(previous => removing ? previous.filter(f => f !== id) : [...previous, id])
    setToast(removing ? 'Đã bỏ khỏi look yêu thích' : 'Đã thêm vào look yêu thích')
  }
  const chooseLook = (index: number, open = false) => {
    const look = looks[index]
    changeOutfit({ garmentId: 'hac-phong', colorId: look.colorId })
    if (open) openBuilder()
  }

  function navigate(label: string) {
    setActiveNav(label)
    setMobileMenu(false)
    if (label === 'Khám phá') window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    if (label === 'Tủ đồ' || label === 'Trang phục') { setQuery(''); setCategory('Bình dân'); collectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }) }
    if (label === 'Phối đồ') openBuilder()
    if (label === 'Sự kiện') occasionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    if (label === 'Câu chuyện Việt' || label === 'Triều Nguyễn') openModal('heritage')
    if (label === 'Đã lưu' || label === 'Bộ sưu tập') openModal('collection')
    if (label === 'Cộng đồng') openModal('community')
  }

  async function saveOutfit() {
    if (saving.current) return
    const signature = outfitKey(outfit)
    if (savedRef.current.some(s => outfitKey(s) === signature)) {
      setToast('Bản phối này đã có trong bộ sưu tập của bạn')
      return
    }
    saving.current = true
    let preview: string | undefined
    try {
      const stage = document.querySelector<HTMLElement>('dialog[open] .character-stage') ?? document.querySelector<HTMLElement>('.look-panel .character-stage')
      const canvas = stage?.dataset.renderer === 'ready' && stage.dataset.garment === outfit.garmentId && stage.dataset.color === outfit.colorId ? stage.querySelector<HTMLCanvasElement>('canvas') : null
      const thumbnail = document.createElement('canvas')
      thumbnail.width = 320; thumbnail.height = 350
      const context = thumbnail.getContext('2d')!
      if (canvas && stage?.dataset.mode !== 'illustration-2.5d') {
        const scale = Math.min(320 / canvas.width, 350 / canvas.height)
        context.drawImage(canvas, (320 - canvas.width * scale) / 2, (350 - canvas.height * scale) / 2, canvas.width * scale, canvas.height * scale)
      } else {
        const view = referenceViews(outfit.garmentId).findIndex(v => v.label === stage?.dataset.view)
        paintThumbnail(context, await prepareIllustration(outfit, Math.max(0, view)), 320, 350)
      }
      preview = thumbnail.toDataURL('image/png')
    } catch { /* The selection can still be saved without a thumbnail. */ }
    const newOutfit: SavedOutfit = { ...outfit, preview, id: crypto.randomUUID(), name: outfitName(outfit), createdAt: new Date().toISOString() }
    const collection = [newOutfit, ...savedRef.current]
    savedRef.current = collection
    setSaved(collection)
    try { localStorage.setItem('resac-collection', JSON.stringify(collection)); setToast('Đã lưu bản phối vào bộ sưu tập của bạn') }
    catch { setToast('Bản phối được giữ trong phiên này. Trình duyệt chưa thể lưu bộ sưu tập.') }
    saving.current = false
  }

  function removeSavedOutfit(id: string) {
    const collection = saved.filter(item => item.id !== id)
    savedRef.current = collection
    setSaved(collection)
    setCompareIds(previous => previous.filter(selected => selected !== id))
    try { localStorage.setItem('resac-collection', JSON.stringify(collection)); setToast('Đã xóa bản phối khỏi bộ sưu tập') }
    catch { setToast('Đã bỏ bản phối trong phiên này. Trình duyệt chưa thể cập nhật dữ liệu lưu.') }
  }

  function toggleComparison(id: string) {
    if (compareIds.includes(id)) { setCompareIds(previous => previous.filter(selected => selected !== id)); return }
    if (compareIds.length >= 2) { setToast('Bỏ chọn một bản phối trước khi thêm bản khác.'); return }
    setCompareIds(previous => [...previous, id])
  }

  function downloadOutfit() {
    const data = { studio: 'RE:SẮC STUDIO', version: 1, name: currentGarment.name, selections: outfit, garment: { name: currentGarment.name, note: currentGarment.note }, palette: { name: currentPalette.name, colors: currentPalette.colors }, occasion: currentOccasion.name, accessories: accessories.filter(a => outfit.accessoryIds.includes(a.id)).map(a => a.name), createdAt: new Date().toISOString() }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `resac-ban-phoi-${currentGarment.id}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 30000)
    setToast('Đã tạo tệp thông tin bản phối để tải về')
  }

  async function shareOutfit() {
    const url = new URL(location.href)
    url.search = ''
    url.hash = ''
    url.searchParams.set('look', JSON.stringify(outfit))
    setShareLink(url.href)
    try { await navigator.clipboard.writeText(url.href); setToast('Đã sao chép liên kết bản phối') }
    catch { setToast('Liên kết bản phối đã sẵn sàng ở bên dưới') }
  }

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = profileDraft.trim()
    if (name.length < 2) { setToast('Nhập tên có ít nhất hai ký tự.'); return }
    setProfile(name)
    try { localStorage.setItem('resac-profile', name) } catch { setToast('Hồ sơ sẽ dùng cho phiên hiện tại') }
    setModal(null)
    setToast(`Chào ${name}, cùng viết tiếp sắc riêng của bạn!`)
  }

  function renderOutfitArt(selection: Outfit & { preview?: string }) {
    if (selection.preview?.startsWith('data:image/png;base64,') && selection.preview.length < 500000) return <Image className="saved-character" src={selection.preview} width={320} height={350} unoptimized alt={`Ảnh bản phối ${outfitName(selection)}`} />
    return <IllustrationThumbnail selection={selection} className="saved-character" />
  }

  function renderModel(selection: Outfit, compact = false) {
    return <div className={`model-scene ${compact ? 'model-compact' : ''}`}><Suspense fallback={<div className="stage-loading" role="status">Đang mở nhân vật…</div>}><CharacterStage outfit={selection} compact={compact} /></Suspense></div>
  }

  function renderBuilderOptions() {
    if (step === 'garment') return <>
      <div className="options-heading"><div><h3>Một dáng áo, một câu chuyện</h3><p>Chọn trang phục để bắt đầu bản phối của bạn.</p></div><select aria-label="Lọc trang phục theo giới tính" value={builderGender} onChange={e => setBuilderGender(e.target.value)}><option>Tất cả</option><option>Nữ</option><option>Nam</option></select></div>
      <div className="builder-search"><Search size={16} /><input type="search" aria-label="Tìm trong tất cả trang phục" placeholder="Tìm tên trang phục hoặc mã mẫu…" value={builderQuery} onChange={e => setBuilderQuery(e.target.value)} />{builderQuery && <button aria-label="Xóa tìm kiếm trang phục" onClick={() => setBuilderQuery('')}><X size={15} /></button>}</div>
      <div className="builder-scope" aria-label="Nhóm trang phục">{['Tất cả', 'Bình dân', 'Cung đình'].map(scope => <button key={scope} aria-pressed={builderScope === scope} onClick={() => setBuilderScope(scope)}>{scope}</button>)}<span>{builderGarments.length} mẫu</span></div>
      <div className="builder-garments">{builderGarments.map(g => <button key={g.id} className={`builder-garment ${outfit.garmentId === g.id ? 'selected' : ''}`} aria-label={`Chọn ${g.name}`} aria-pressed={outfit.garmentId === g.id} onClick={() => selectGarment(g)}><GarmentArtwork garment={g} /><span>{g.name}</span><small>{g.royal ? g.subtitle : g.gender}</small>{outfit.garmentId === g.id && <i className="selection-check"><Check size={13} /></i>}</button>)}</div>
      {builderGarments.length === 0 && <EmptyState title="Chưa tìm thấy trang phục" description="Thử tên hoặc mã mẫu khác, hoặc xem toàn bộ tủ đồ."><button className="text-button" onClick={() => { setBuilderQuery(''); setBuilderGender('Tất cả'); setBuilderScope('Tất cả') }}>Xem tất cả trang phục<ArrowRight size={15} /></button></EmptyState>}
      <GarmentProvenance garment={currentGarment} />
      {currentGarment.royal && <div className="culture-note"><ShieldCheck size={20} /><div><p>{currentGarment.note}</p><a className="text-button" href={currentGarment.artwork.source} target="_blank" rel="noreferrer">Xem ảnh catalog đầy đủ<ArrowRight size={13} /></a></div></div>}
    </>
    if (step === 'occasion') return <><div className="options-heading"><div><h3>Bạn sẽ mặc vào dịp nào?</h3><p>Để mỗi lần xuất hiện là một kỷ niệm đẹp.</p></div></div><div className="occasion-options">{occasions.map(o => <button className={`occasion-option ${outfit.occasionId === o.id ? 'selected' : ''}`} key={o.id} aria-pressed={outfit.occasionId === o.id} onClick={() => changeOutfit({ occasionId: o.id })}><span className="occasion-symbol"><OccasionSymbol id={o.id} size={32} /></span><span>{o.name}</span><small>{o.description}</small>{outfit.occasionId === o.id && <Check size={18} />}</button>)}</div></>
    if (step === 'color') return <><div className="options-heading"><div><h3>Chọn sắc màu của riêng bạn</h3><p>Những cặp màu gợi cảm hứng cho bản phối.</p></div></div><div className="large-palette">{palettes.map(p => <button key={p.id} className={`color-option ${outfit.colorId === p.id ? 'selected' : ''}`} aria-label={`Chọn bảng màu ${p.name}`} onClick={() => changeOutfit({ colorId: p.id })} aria-pressed={outfit.colorId === p.id}><span className="color-pair">{p.colors.map(c => <i key={c} style={{ background: c }} />)}</span><span>{p.name}</span><small>{p.meaning}</small>{outfit.colorId === p.id && <Check size={16} />}</button>)}</div><p className="option-footnote">Bảng màu là gợi ý sáng tạo; không đại diện cho quy chế phẩm phục lịch sử.</p></>
    if (step === 'accessory') return <><div className="options-heading"><div><h3>Đẹp từ những chi tiết nhỏ</h3><p>Chọn phụ kiện để lưu cùng bản phối của bạn.</p></div><span className="count-badge">{outfit.accessoryIds.length} đã chọn</span></div><p className="option-footnote">Minh họa giữ phụ kiện trong ảnh gốc. Các lựa chọn thêm/bớt hiển thị ở chế độ 3D thử nghiệm.</p><div className="accessory-options">{accessories.map(a => <button key={a.id} className={`accessory-option ${outfit.accessoryIds.includes(a.id) ? 'selected' : ''}`} aria-pressed={outfit.accessoryIds.includes(a.id)} onClick={() => toggleAccessory(a.id)}><span className="wardrobe-accessory-icon"><AccessorySymbol id={a.id} /></span><span>{a.name}</span><small>{a.detail}</small>{outfit.accessoryIds.includes(a.id) && <i className="selection-check"><Check size={14} /></i>}</button>)}</div></>
    return <><div className="options-heading"><div><h3>Di sản gặp tinh thần của bạn</h3><p>Chọn cách bạn muốn kể câu chuyện qua trang phục.</p></div></div><p className="option-footnote">Minh họa giữ phom áo trong ảnh gốc. Phong cách thay đổi phom áo trên mô hình 3D thử nghiệm.</p><div className="style-options">{styles.map((s, i) => <button key={s.id} className={`style-option ${outfit.style === s.id ? 'selected' : ''}`} aria-label={`Chọn phong cách ${s.id}`} aria-pressed={outfit.style === s.id} onClick={() => changeOutfit({ style: s.id })}>{i === 0 ? <BookOpen size={32} /> : i === 1 ? <Flower2 size={32} /> : <Sparkles size={32} />}<div><span>{s.id}</span><p>{s.description}</p></div>{outfit.style === s.id && <Check size={20} />}</button>)}</div><div className="culture-note"><ShieldCheck size={22} /><p>Sáng tạo từ cảm hứng truyền thống. Bản phối remix và hình concept được phân biệt với trang phục phục dựng.</p></div></>
  }

  return <>
    <header className="site-header">
      <div className="header-inner">
        <a href="#" className="brand-link" aria-label="RE:SẮC Studio — trang chủ" onClick={e => { e.preventDefault(); navigate('Khám phá') }}><Brand /></a>
        <nav className={`desktop-nav ${mobileMenu ? 'menu-open' : ''}`} aria-label="Điều hướng chính">{['Tủ đồ', 'Phối đồ', 'Câu chuyện Việt', 'Đã lưu'].map(label => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => navigate(label)}>{label}{label === 'Đã lưu' && saved.length > 0 && <sup>{saved.length}</sup>}</button>)}<form className="mobile-search" role="search" onSubmit={e => { e.preventDefault(); setMobileMenu(false); collectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }) }}><Search size={17} /><input aria-label="Tìm trang phục trên điện thoại" type="search" placeholder="Tìm trong tủ đồ…" value={query} onChange={e => setQuery(e.target.value)} /><button type="submit" aria-label="Tìm kiếm"><ArrowRight size={16} /></button></form></nav>
        <form className="header-search" role="search" onSubmit={e => { e.preventDefault(); collectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }) }}><Search size={17} /><input aria-label="Tìm trang phục" type="search" placeholder="Tìm trang phục, cảm hứng…" value={query} onChange={e => setQuery(e.target.value)} /><span className="search-spark"><Sparkles size={12} /></span></form>
        <button className="icon-button theme-button" aria-label={`Chuyển sang giao diện ${theme === 'night' ? 'sáng' : 'tối'}`} onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}>{theme === 'night' ? <Moon size={19} fill="currentColor" /> : <Sun size={20} />}</button>
        <button className="profile-button" onClick={() => { setProfileDraft(profile); openModal('profile') }}>{profile ? <><CircleUserRound size={16} /><span>{profile}</span></> : 'Hồ sơ'}</button>
        <button className="icon-button mobile-menu-button" aria-label={mobileMenu ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>

    <HeritageHome outfit={outfit} saved={saved} query={query} category={category} setQuery={setQuery} setCategory={setCategory} collectionRef={collectionRef} occasionRef={occasionRef} selectGarment={selectGarment} changeOutfit={changeOutfit} openBuilder={openBuilder} openStory={() => openModal('story')} openHeritage={() => openModal('heritage')} openCollection={() => openModal('collection')} openResult={() => openModal('result')} saveOutfit={saveOutfit} preview={<Suspense fallback={<div className="stage-loading" role="status">Đang mở bản phối…</div>}><CharacterStage outfit={outfit} compact active={modal === null} /></Suspense>} />

    <nav className="mobile-bottom-nav" aria-label="Điều hướng trên điện thoại"><button className={modal === null ? 'active' : ''} onClick={() => { setModal(null); navigate('Khám phá') }}><House size={21} /><span>Tủ đồ</span></button><button className={modal === 'builder' ? 'active' : ''} onClick={() => openBuilder()}><Shirt size={21} /><span>Phối đồ</span></button><button className="mobile-studio-symbol" aria-label="Tìm hiểu di sản Việt phục" onClick={() => openModal('heritage')}><Flower2 size={23} /><span>Di sản</span></button><button className={modal === 'collection' ? 'active' : ''} onClick={() => openModal('collection')}><Heart size={21} /><span>Đã lưu</span></button><button className={modal === 'profile' ? 'active' : ''} onClick={() => { setProfileDraft(profile); openModal('profile') }}><CircleUserRound size={21} /><span>Cá nhân</span></button></nav>

    {modal === 'builder' && <Modal title="Phối sắc riêng" eyebrow="VIỆT PHỤC · SẮC RIÊNG CỦA BẠN" className="builder-modal" onClose={() => setModal(null)}><div className="builder-layout"><div className="builder-preview">{renderModel(outfit)}<div className="preview-note"><Sparkles size={14} /><span>Xem trang phục và màu đã chọn.</span></div><div className="builder-summary"><span>{currentOccasion.shortName}</span><span>{outfit.style}</span><span>{currentPalette.name}</span></div></div><div className="builder-options"><div className="builder-step-tabs" role="tablist" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const current = steps.findIndex(s => s.id === step)
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + steps.length) % steps.length
          setStep(steps[next].id)
          event.currentTarget.querySelector<HTMLButtonElement>('#step-' + steps[next].id)?.focus()
        }} aria-label="Các bước phối đồ">{steps.map(s => <button role="tab" tabIndex={step === s.id ? 0 : -1} aria-selected={step === s.id} aria-controls="builder-step-content" id={`step-${s.id}`} key={s.id} className={step === s.id ? 'active' : ''} onClick={() => setStep(s.id)}><StepIcon step={s.id} size={21} /><span>{s.short}</span></button>)}</div><div key={step} id="builder-step-content" className="builder-step-content" role="tabpanel" aria-labelledby={`step-${step}`}>{renderBuilderOptions()}</div></div></div><div className="builder-footer"><button className="text-button" onClick={() => { const index = steps.findIndex(s => s.id === step); if (index > 0) setStep(steps[index - 1].id); else setModal(null) }}><ArrowLeft size={16} />{step === 'garment' ? 'Khám phá' : 'Quay lại'}</button><span>{steps.findIndex(s => s.id === step) + 1} / {steps.length}</span><button className="button button-gold" onClick={() => { const index = steps.findIndex(s => s.id === step); if (index < steps.length - 1) setStep(steps[index + 1].id); else openModal('result') }}>{step === 'style' ? 'Xem bản phối' : 'Tiếp theo'}<ArrowRight size={16} /></button></div></Modal>}

    {modal === 'result' && <Modal title="Bản phối của bạn" eyebrow="MỘT BẢN PHỐI · MỘT CÂU CHUYỆN" className="result-modal" onClose={() => setModal(null)}><div className="result-layout"><div className="result-preview">{renderModel(outfit)}<button className="button button-outline" onClick={() => openBuilder()}><Shirt size={17} />Tiếp tục phối đồ<ArrowRight size={15} /></button></div><div className="result-details"><div className="result-title"><span className="eyebrow">RE:SẮC · NẾP ÁO VIỆT, SẮC RIÊNG</span><h3>{outfitName(outfit)}</h3><p>{currentGarment.subtitle}</p></div><div className="story-note"><Sparkles size={22} /><div><h4>Vì sao bản phối này phù hợp?</h4><p>{currentGarment.note}</p><p>{currentOccasion.description} Phong cách {outfit.style.toLocaleLowerCase('vi')} và bảng màu {currentPalette.name.toLocaleLowerCase('vi')} mang thêm dấu ấn của bạn.</p></div></div><div className="result-tags"><span>{currentOccasion.shortName}</span><span>{outfit.style}</span><span>{currentPalette.name}</span></div><div className="detail-box"><h4>Chi tiết bản phối</h4><dl><div><dt>Trang phục</dt><dd>{currentGarment.name}</dd></div><div><dt>Bảng màu</dt><dd><span className="inline-colors">{currentPalette.colors.map(c => <i key={c} style={{ background: c }} />)}</span>{currentPalette.name}</dd></div><div><dt>Phụ kiện</dt><dd>{accessories.filter(a => outfit.accessoryIds.includes(a.id)).map(a => a.name).join(' · ') || 'Chưa chọn phụ kiện'}</dd></div><div><dt>Dịp sử dụng</dt><dd>{currentOccasion.name}</dd></div></dl></div><GarmentProvenance garment={currentGarment} /><div className="culture-note"><ShieldCheck size={23} /><div><strong>Tôn trọng bối cảnh văn hóa</strong><p>Ảnh concept và bản phối sáng tạo không thay thế tư liệu phục dựng trang phục lịch sử.</p></div></div><div className="result-actions"><button className="button button-gold" onClick={saveOutfit}><Heart size={17} />Lưu bản phối</button><button className="icon-button" aria-label="Chia sẻ bản phối" onClick={shareOutfit}><Share2 size={19} /></button><button className="icon-button" aria-label="Tải thông tin bản phối" onClick={downloadOutfit}><ArrowDownToLine size={19} /></button></div>{shareLink && <label className="share-link">Liên kết bản phối<input readOnly aria-label="Liên kết bản phối" value={shareLink} onFocus={e => e.target.select()} /></label>}</div></div></Modal>}

    {modal === 'story' && <Modal title="Nếp áo Việt, trong đời sống hôm nay" eyebrow="CHUYỆN NẾP ÁO" className="story-modal" onClose={() => setModal(null)}><div className="story-cover" role="img" aria-label="Minh họa áo ngũ thân bên hiên nhà Huế" /><div className="story-content"><blockquote>“Mặc một nếp áo quen, kể một câu chuyện mới.”</blockquote><p>Một buổi dạo phố, một lần về quê, một cuộc hẹn đầu năm. Việt phục có thể trở thành một phần của những khoảnh khắc rất gần trong đời sống.</p><p>RE:SẮC bắt đầu từ các dáng áo ngũ thân, tứ thân, áo dài và nhật bình. Bạn có thể tìm hiểu câu chuyện của từng mẫu, thử bảng màu, rồi giữ lại bản phối mình yêu thích.</p><div className="culture-note"><ShieldCheck size={23} /><p>Ảnh và nhân vật trong studio là minh họa sáng tạo. Khi tìm hiểu trang phục lịch sử, hãy đối chiếu nguồn tư liệu và bối cảnh của từng dáng áo.</p></div><button className="button button-gold" onClick={() => openBuilder()}>Thử một dáng áo Việt<ArrowRight size={17} /></button></div></Modal>}

    {modal === 'heritage' && <Modal title="Gốc rễ để viết tiếp" eyebrow="TÌM HIỂU VIỆT PHỤC" className="heritage-modal" onClose={() => setModal(null)}><div className="heritage-body"><div className="heritage-intro"><Flower2 size={37} /><h3>Việt phục, hơn một dáng áo.</h3><p>Mỗi trang phục gắn với một bối cảnh: người mặc, dịp sử dụng và tinh thần của thời đại. RE:SẮC mở một không gian khám phá và sáng tạo từ những cảm hứng ấy.</p></div><div className="heritage-principles"><div><BookOpen /><h4>Có gốc để tìm hiểu</h4><p>Catalog có tên mẫu, bối cảnh và đường dẫn tư liệu tham khảo.</p></div><div><Flower2 /><h4>Có khoảng để sáng tạo</h4><p>Bản remix mang sắc riêng, được ghi rõ là cảm hứng đương đại.</p></div><div><ShieldCheck /><h4>Có sự trân trọng</h4><p>Trang phục cung đình được phân biệt với trang phục dân gian và cách tân.</p></div></div><h4 className="sources-title">Tư liệu để bắt đầu</h4>{nguyenSources.map(source => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><small>SỞ VĂN HÓA, THỂ THAO VÀ DU LỊCH HUẾ</small>{source.title}</span><ArrowRight size={19} /></a>)}<a className="source-link" href="https://baotanglichsuquocgia.vn/vi/Articles/3096/18303/trang-phuc-cung-djinh-trieu-nguyen.html" target="_blank" rel="noreferrer"><span><small>BẢO TÀNG LỊCH SỬ QUỐC GIA</small>Trang phục cung đình triều Nguyễn</span><ArrowRight size={19} /></a><a className="source-link" href="https://viensuhoc.vass.gov.vn/cong-trinh-tieu-bieu/kham-dinh-dai-nam-hoi-dien-su-le-434959" target="_blank" rel="noreferrer"><span><small>VIỆN SỬ HỌC</small>Khâm định Đại Nam hội điển sự lệ</span><ArrowRight size={19} /></a><button className="button button-gold" onClick={() => openBuilder()}>Khám phá tủ đồ<ArrowRight size={17} /></button></div></Modal>}

    {modal === 'collection' && <Modal title="Tủ đồ của tôi" eyebrow="LƯU LẠI NHỮNG SẮC MÀU YÊU THÍCH" className="collection-modal" onClose={() => setModal(null)}><div className="collection-body">{saved.length === 0 && favorites.length === 0 ? <EmptyState title="Một câu chuyện đang chờ được viết" description="Lưu bản phối hoặc thả tim một bản phối mẫu. Tất cả sẽ ở đây, trên trình duyệt của bạn."><button className="button button-gold" onClick={() => openBuilder()}>Tạo bản phối đầu tiên<ArrowRight size={17} /></button></EmptyState> : <>{saved.length > 0 && <><div className="collection-toolbar"><p>Chọn hai bản phối để đối chiếu màu sắc và dịp mặc.<br />{compareOutfits.length} / 2 bản phối đã chọn</p><button className="button button-gold" disabled={compareOutfits.length !== 2} onClick={() => openModal('compare')}>So sánh hai bản phối<ArrowRight size={15} /></button></div><h3 className="collection-section-label">Bản phối đã lưu <span>{saved.length}</span></h3><div className="saved-grid">{saved.map(s => <article key={s.id} className="saved-card"><button className="saved-image" aria-label={`Mở bản phối ${s.name}`} onClick={() => { changeOutfit(parseOutfit(s)!); openModal('result') }}>{renderOutfitArt(s)}</button><div><h4>{s.name}</h4><p>{occasions.find(o => o.id === s.occasionId)?.shortName} · {s.style}</p><small>{new Date(s.createdAt).toLocaleDateString('vi-VN')}</small><button className="compare-choice" aria-label={`Chọn so sánh ${s.name}`} aria-pressed={compareIds.includes(s.id)} onClick={() => toggleComparison(s.id)}><i>{compareIds.includes(s.id) && <Check size={12} />}</i>Chọn so sánh</button><button className="icon-button" aria-label={`Xóa bản phối ${s.name}`} onClick={() => { removeSavedOutfit(s.id) }}><Trash2 size={16} /></button></div></article>)}</div></>}{favorites.length > 0 && <><h3 className="collection-section-label">Bản phối yêu thích <span>{favorites.length}</span></h3><div className="saved-grid">{looks.filter(l => favorites.includes(l.id)).map(l => <article className="saved-card" key={l.id}><button className="saved-image" onClick={() => chooseLook(looks.indexOf(l), true)} aria-label={`Thử phối ${l.name}`}><IllustrationThumbnail selection={{ garmentId: 'hac-phong', colorId: l.colorId }} /></button><div><h4>{l.name}</h4><p>Cảm hứng đương đại</p><button className="icon-button is-favorite" aria-label={`Bỏ yêu thích ${l.name}`} onClick={() => toggleFavorite(l.id)}><Heart size={17} fill="currentColor" /></button></div></article>)}</div></> }<p className="collection-storage-note">Bộ sưu tập được lưu trên trình duyệt này. Bạn có thể tải thông tin từng bản phối để giữ một bản riêng.</p></>}</div></Modal>}

    {modal === 'compare' && <Modal title="So sánh hai bản phối" eyebrow="TỦ ĐỒ DI SẢN CỦA BẠN" className="comparison-modal" onClose={() => openModal('collection')}><OutfitComparison outfits={compareOutfits} renderArt={renderOutfitArt} onOpen={s => { changeOutfit(parseOutfit(s)!); openModal('result') }} /></Modal>}

    {modal === 'community' && <Modal title="Cùng nhau viết tiếp Việt phục" eyebrow="RE:SẮC · CẢM HỨNG CỘNG ĐỒNG" className="community-modal" onClose={() => setModal(null)}><div className="community-body"><p className="community-intro">Một dáng áo có thể mang nhiều sắc thái. Bắt đầu từ những bản phối của studio, rồi chia sẻ bản phối mang tinh thần của bạn.</p><div className="community-grid">{looks.map((look, i) => <button key={look.id} onClick={() => chooseLook(i, true)}><IllustrationThumbnail selection={{ garmentId: 'hac-phong', colorId: look.colorId }} /><span>{look.name}</span><small>{look.description}</small><span className="text-button">Thử bản phối<ArrowRight size={14} /></span></button>)}</div><button className="button button-gold" onClick={() => openModal('result')}><Share2 size={17} />Chia sẻ bản phối của tôi</button></div></Modal>}

    {modal === 'profile' && <Modal title={profile ? `Studio của ${profile}` : 'Chào bạn, người viết tiếp di sản.'} eyebrow="KHÔNG GIAN CỦA BẠN" className="profile-modal" onClose={() => setModal(null)}><form className="profile-form" onSubmit={submitProfile}><div className="profile-emblem"><Brand compact /></div><p>Đặt tên để lưu hồ sơ và tiếp tục sáng tạo trên trình duyệt này.</p><label>Tên của bạn<input value={profileDraft} onChange={e => setProfileDraft(e.target.value)} required minLength={2} maxLength={32} placeholder="Bạn muốn studio gọi mình là…" autoComplete="nickname" /></label><button className="button button-gold" type="submit">{profile ? 'Lưu tên' : 'Vào studio'}<ArrowRight size={17} /></button><button type="button" className="text-button" onClick={() => openModal('collection')}><BookOpen size={17} />Xem bộ sưu tập của tôi</button>{profile && <button type="button" className="profile-signout" onClick={() => { setProfile(''); setProfileDraft(''); try { localStorage.removeItem('resac-profile') } catch { /* Session profile is still cleared. */ } setModal(null); setToast('Đã rời hồ sơ. Bộ sưu tập vẫn được giữ trên trình duyệt.') }}>Rời hồ sơ</button>}</form></Modal>}

    {toast && <Toast key={modal ?? 'page'} message={toast} onClose={() => setToast('')} />}
  </>
}
