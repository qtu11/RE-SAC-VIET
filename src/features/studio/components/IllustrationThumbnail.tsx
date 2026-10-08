'use client'

import { useEffect, useRef, useState } from 'react'
import type { Garment } from '../data'
import { garmentById, palettes } from '../data'
import { Art } from '../../../components/ui'
import { garmentProfiles } from '../wardrobe'
import { illustrationKey, paintThumbnail, prepareIllustration } from '../illustration-renderer'
import type { IllustrationSelection } from '../illustration-renderer'

// The same source frame, mask and palette as the large character preview.
// Async results are keyed so rapidly changing selections cannot show old art.
export function IllustrationThumbnail({ selection, viewIndex = 0, className = '' }: { selection: IllustrationSelection; viewIndex?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState({ key: '', status: 'loading' })
  const key = illustrationKey(selection, viewIndex)
  const garment = garmentById(selection.garmentId)
  const color = palettes.find(p => p.id === selection.colorId)?.name ?? ''
  const status = result.key === key ? result.status : 'loading'
  useEffect(() => {
    let cancelled = false
    const [garmentId, colorId, angle] = key.split(':')
    prepareIllustration({ garmentId, colorId }, Number(angle)).then(art => {
      if (cancelled || !canvas.current) return
      const context = canvas.current.getContext('2d')
      if (!context) { setResult({ key, status: 'error' }); return }
      paintThumbnail(context, art, canvas.current.width, canvas.current.height)
      setResult({ key, status: 'ready' })
    }).catch(() => { if (!cancelled) setResult({ key, status: 'error' }) })
    return () => { cancelled = true }
  }, [key])
  return <span className={`illustration-thumbnail ${className}`} data-status={status} data-garment={garment.id} data-color={selection.colorId} aria-busy={status === 'loading'}>
    <canvas ref={canvas} width={320} height={480} role="img" aria-label={`${garment.name} · ${color}`} />
    {status !== 'ready' && <span className="thumbnail-state">{status === 'error' ? 'Ảnh chưa tải được' : 'Đang tải ảnh…'}</span>}
  </span>
}

export function GarmentArtwork({ garment }: { garment: Garment }) {
  if (garment.folk || garment.royal || garment.id === 'hac-phong') return <IllustrationThumbnail className="garment-art" selection={{ garmentId: garment.id, colorId: garmentProfiles[garment.id].defaultColorId }} />
  return <span className="garment-art"><Art artwork={garment.artwork} label={garment.name} /></span>
}
