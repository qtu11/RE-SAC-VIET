'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, X, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Artwork } from '../features/studio/data'

export function Art({ artwork, label = '', className = '' }: { artwork: Artwork; label?: string; className?: string }) {
  const [x, y, width, height] = artwork.rect
  const [sourceWidth, sourceHeight] = artwork.size ?? [1536, 1024]
  return <svg className={`artwork ${className}`} viewBox={`${x} ${y} ${width} ${height}`} preserveAspectRatio="xMidYMid slice" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
    <image href={artwork.source} width={sourceWidth} height={sourceHeight} />
  </svg>
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className={`brand ${compact ? 'brand-compact' : ''}`}>
    <svg className="brand-mark" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M28 8c-10 12-11 23 0 34 11-11 10-22 0-34Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M28 42C14 40 8 31 8 17c13 3 20 12 20 25Zm0 0c14-2 20-11 20-25-13 3-20 12-20 25Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M28 44C15 47 6 43 3 33c10-1 19 3 25 11Zm0 0c13 3 22-1 25-11-10-1-19 3-25 11ZM13 51h30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className="brand-type"><span>RE:SẮC <b>STUDIO</b></span><small>VIỆT PHỤC & ĐỜI SỐNG</small></span>
  </span>
}

export function Modal({ children, title, eyebrow, onClose, className = '' }: { children: ReactNode; title: string; eyebrow?: string; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = ref.current
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => { document.body.style.overflow = previous; dialog?.close() }
  }, [])
  return <dialog ref={ref} className={`modal ${className}`} aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="modal-shell">
      <header className="modal-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2 id={titleId}>{title}</h2></div><button className="icon-button modal-close" aria-label="Đóng" onClick={onClose} autoFocus><X size={22} /></button></header>
      {children}
    </div>
  </dialog>
}

export function SectionHeading({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</div>
}

export function EmptyState({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="empty-state"><Sparkles size={32} /><h3>{title}</h3><p>{description}</p>{children}</div>
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [host, setHost] = useState<HTMLElement | null>(null)
  // Resolve after dialogs have mounted/unmounted. A render-time lookup can
  // otherwise portal the notification into the dialog being removed.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setHost(document.querySelector('dialog[open]') ?? document.body))
    return () => cancelAnimationFrame(frame)
  }, [])
  if (!host || !message) return null
  return createPortal(<div className="toast" role="status"><Check size={18} /><span>{message}</span><button aria-label="Ẩn thông báo" onClick={onClose}><X size={15} /></button></div>, host)
}
