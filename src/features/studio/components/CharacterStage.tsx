'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight, Image as ImageIcon, Pause, Play, RotateCcw, Sparkles, Wind, ZoomIn, ZoomOut } from 'lucide-react'
import { accessories, garmentById, occasions, outfitName, palettes } from '../data'
import type { Outfit } from '../data'
import { illustrationKey, paintIllustration, prepareIllustration } from '../illustration-renderer'
import type { Illustration } from '../illustration-renderer'
import { referenceViews } from '../reference'
import type { IllustrationMotion } from '../reference'
import './character.css'

type Controls = { tilt: number; zoom: number; moving: boolean; motion: IllustrationMotion; original: boolean; active: boolean; ready: boolean }

const ExperimentalStage = dynamic(() => import('./ExperimentalStage'), { ssr: false, loading: () => <div className="stage-loading" role="status">Đang mở mô hình thử nghiệm…</div> })
type StageProps = { outfit: Outfit; compact?: boolean; active?: boolean }

export default function CharacterStage(props: StageProps) {
  const [mode, setMode] = useState<'illustration' | 'mesh'>('illustration')
  return <div className={`stage-wrapper ${props.compact ? 'stage-wrapper-compact' : ''}`}>
    {!props.compact && <div className="stage-mode-tabs" aria-label="Chế độ xem nhân vật"><button aria-pressed={mode === 'illustration'} onClick={() => setMode('illustration')}>Minh họa theo mẫu</button><button aria-pressed={mode === 'mesh'} onClick={() => setMode('mesh')}>3D thử nghiệm</button></div>}
    {mode === 'mesh' ? <><ExperimentalStage {...props} /><span className="experimental-scope">Mô hình thử chưa giống ảnh mẫu</span></> : <IllustrationStage key={props.outfit.garmentId} {...props} />}
  </div>
}

function IllustrationStage({ outfit, compact = false, active = true }: StageProps) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const art = useRef<Illustration | null>(null)
  const [result, setResult] = useState<{ key: string; status: 'ready' | 'error' }>({ key: '', status: 'ready' })
  const [attempt, setAttempt] = useState(0)
  const [viewIndex, setViewIndex] = useState(0)
  const [moving, setMoving] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [motion, setMotion] = useState<IllustrationMotion>('breathing')
  const [original, setOriginal] = useState(false)
  const [tilt, setTilt] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [captureMessage, setCaptureMessage] = useState('')
  const elapsedSeconds = useRef(0)
  const controls = useRef<Controls>({ tilt, zoom, moving, motion, original, active, ready: false })
  const drag = useRef<{ x: number; tilt: number } | null>(null)
  const garment = garmentById(outfit.garmentId)
  const palette = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  const occasion = occasions.find(o => o.id === outfit.occasionId) ?? occasions[2]
  const selectedAccessories = accessories.filter(a => outfit.accessoryIds.includes(a.id))
  const views = referenceViews(outfit.garmentId)
  const currentView = Math.min(viewIndex, views.length - 1)
  const key = illustrationKey(outfit, currentView)
  const status = result.key === key ? result.status : 'loading'

  useEffect(() => {
    let cancelled = false
    const [garmentId, colorId, angle] = key.split(':')
    prepareIllustration({ garmentId, colorId }, Number(angle)).then(illustration => {
      if (cancelled) return
      art.current = illustration
      setResult({ key, status: 'ready' })
    }).catch(() => { if (!cancelled) setResult({ key, status: 'error' }) })
    return () => { cancelled = true }
  }, [key, attempt])

  useEffect(() => { controls.current = { tilt, zoom, moving, motion, original, active, ready: status === 'ready' } }, [tilt, zoom, moving, motion, original, active, status])

  useEffect(() => {
    const element = host.current, surface = canvas.current
    if (!element || !surface) return
    const context = surface.getContext('2d')
    if (!context) return
    let width = 1, height = 1, visible = true, previous = 0, lastDraw = 0, request = 0
    const resize = () => {
      const rect = element.getBoundingClientRect()
      width = Math.max(1, rect.width); height = Math.max(1, rect.height)
      const ratio = Math.min(window.devicePixelRatio, 1.8)
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(element); resize()
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting }, { threshold: .01 }); visibility.observe(element)
    const draw = (time: number) => {
      request = requestAnimationFrame(draw)
      if (document.hidden || !visible || !controls.current.active) { previous = time; return }
      if (time - lastDraw < 1000 / (compact ? 20 : 30)) return
      const delta = previous ? Math.min(.1, (time - previous) / 1000) : 0
      previous = time; lastDraw = time
      if (controls.current.moving && !controls.current.original) elapsedSeconds.current += delta
      if (!art.current || !controls.current.ready) { context.clearRect(0, 0, width, height); return }
      const value = controls.current
      paintIllustration(context, art.current, width, height, elapsedSeconds.current, value.motion, value.moving, value.tilt, value.zoom, value.original, compact)
    }
    request = requestAnimationFrame(draw)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPreference = () => { if (preference.matches) setMoving(false) }
    preference.addEventListener('change', onPreference)
    return () => { cancelAnimationFrame(request); sizeObserver.disconnect(); visibility.disconnect(); preference.removeEventListener('change', onPreference) }
  }, [compact])

  function capture() {
    const surface = canvas.current, illustration = art.current
    if (!surface || !illustration || status !== 'ready') return
    const context = surface.getContext('2d'), rect = surface.getBoundingClientRect()
    if (!context || !rect.width || !rect.height) return
    // Paint the current selection before exporting, even if its first animation
    // frame has not run yet. Never capture a stale or empty canvas.
    context.save()
    context.setTransform(surface.width / rect.width, 0, 0, surface.height / rect.height, 0, 0)
    paintIllustration(context, illustration, rect.width, rect.height, elapsedSeconds.current, motion, moving, tilt, zoom, original, compact)
    context.restore()
    surface.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a'); link.href = url; link.download = `resac-${outfit.garmentId}-minh-hoa.png`
      document.body.appendChild(link); link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30000)
      setCaptureMessage('Ảnh PNG của bản xem trước đã được tạo.')
    }, 'image/png')
  }

  return <div className={`character-stage illustration-stage ${compact ? 'character-compact' : ''}`} data-testid="character-stage" data-garment={outfit.garmentId} data-color={outfit.colorId} data-accessories={outfit.accessoryIds.join(',')} data-moving={moving && !original} data-pose={motion} data-angle={tilt} data-view={views[currentView].label} data-renderer={status} data-mode="illustration-2.5d" data-occasion={outfit.occasionId} data-style={outfit.style} data-zoom={zoom}>
    <div className="stage-backdrop" data-occasion={outfit.occasionId} aria-hidden="true"><i /><i /><i /></div>
    <div className="stage-badge"><Sparkles size={13} /><span>MINH HỌA 2.5D</span><i className={moving && !original ? 'live' : ''} /></div>
    <div ref={host} className="character-canvas" tabIndex={0} aria-label={`Minh họa ${garment.name}, màu ${palette.name}. Kéo nhẹ để nghiêng ảnh, dùng nút đổi góc khi mẫu có nhiều ảnh.`}
      onPointerDown={e => { if (original) return; drag.current = { x: e.clientX, tilt }; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={e => { if (drag.current) setTilt(Math.round(Math.max(-12, Math.min(12, drag.current.tilt + (e.clientX - drag.current.x) / 8)))) }}
      onPointerUp={e => { drag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId) }}
      onPointerCancel={() => { drag.current = null }}
      onKeyDown={e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setTilt(t => Math.max(-12, Math.min(12, t + (e.key === 'ArrowLeft' ? -4 : 4)))) }
        if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(z => Math.min(1.8, z + .15)) }
        if (e.key === '-') { e.preventDefault(); setZoom(z => Math.max(.65, z - .15)) }
        if (e.key === 'Home') { e.preventDefault(); setZoom(1); setTilt(0) }
      }}><canvas ref={canvas} role="img" aria-label={`Bản xem trước ${original ? 'màu gốc' : palette.name} · ${views[currentView].label}`} /></div>
    {status === 'loading' && <div className="stage-loading" role="status"><Sparkles size={28} />Đang mở ảnh nhân vật…</div>}
    {status === 'error' && <div className="stage-error" role="alert"><ImageIcon size={28} /><strong>Chưa tải được ảnh nhân vật</strong><button className="button button-gold" onClick={() => { setResult({ key: '', status: 'ready' }); setAttempt(a => a + 1) }}>Thử lại</button></div>}
    {!compact && <div className="stage-outfit-info"><strong>{outfitName(outfit)}</strong><span><i style={{ background: palette.colors[0] }} /><i style={{ background: palette.colors[1] }} />{original ? 'Màu gốc trong ảnh' : palette.name} · {occasion.shortName} · {outfit.style}</span><small>{selectedAccessories.map(a => a.name).join(' · ') || 'Chưa chọn phụ kiện thêm'}</small></div>}
    {!compact && views.length > 1 && <div className="stage-reference-views" aria-label="Các góc trong ảnh mẫu">{views.map((view, index) => <button key={view.label} aria-pressed={currentView === index} onClick={() => { setViewIndex(index); setTilt(0) }}>{view.label}</button>)}</div>}
    <div className="stage-controls" aria-label="Điều khiển minh họa nhân vật">
      <div className="stage-view-controls">
        <button aria-label="Nghiêng ảnh sang trái" onClick={() => setTilt(t => Math.max(-12, t - 4))} disabled={status !== 'ready' || original || tilt <= -12}><ChevronLeft size={17} /></button>
        <button aria-label={original ? 'Xem màu đã phối' : 'Xem màu gốc của ảnh'} aria-pressed={original} title="Đối chiếu màu gốc" onClick={() => setOriginal(!original)} disabled={status !== 'ready'}><ImageIcon size={16} /></button>
        <button aria-label="Nghiêng ảnh sang phải" onClick={() => setTilt(t => Math.min(12, t + 4))} disabled={status !== 'ready' || original || tilt >= 12}><ChevronRight size={17} /></button>
        {!compact && <><span className="stage-control-divider" /><button aria-label="Phóng to nhân vật" onClick={() => setZoom(z => Math.min(1.8, z + .15))} disabled={status !== 'ready' || zoom >= 1.8}><ZoomIn size={16} /></button><button aria-label="Thu nhỏ nhân vật" onClick={() => setZoom(z => Math.max(.65, z - .15))} disabled={status !== 'ready' || zoom <= .65}><ZoomOut size={16} /></button><button aria-label="Đặt lại góc nhìn" onClick={() => { setTilt(0); setZoom(1); setOriginal(false) }} disabled={status !== 'ready'}><RotateCcw size={15} /></button></>}
        <button aria-label={moving ? 'Tạm dừng chuyển động' : 'Bật chuyển động'} aria-pressed={moving && !original} onClick={() => { setMoving(!moving); setOriginal(false) }} disabled={status !== 'ready'}>{moving && !original ? <Pause size={15} /> : <Play size={15} />}</button>
      </div>
      {!compact && <div className="stage-pose-controls"><span>Kéo để nghiêng ảnh</span><button aria-pressed={motion === 'breathing'} onClick={() => { setMotion('breathing'); setMoving(true); setOriginal(false) }}><Sparkles size={13} />Thở nhẹ</button><button aria-pressed={motion === 'breeze'} onClick={() => { setMotion('breeze'); setMoving(true); setOriginal(false) }}><Wind size={14} />Tà áo</button></div>}
    </div>
    {!compact && <button className="stage-capture" onClick={capture} disabled={status !== 'ready'}>Chụp ảnh</button>}
    {!compact && <span className="stage-scope">Ảnh giữ phụ kiện có sẵn. Thử đổi phụ kiện ở chế độ 3D.</span>}
    <span className="sr-only" role="status">{captureMessage}</span>
  </div>
}
