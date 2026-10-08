import { garmentById, palettes } from './data.ts'
import type { Artwork, Outfit } from './data.ts'
import { garmentProfiles } from './wardrobe.ts'
import { catalogArtwork, catalogNeckline } from './catalog-artwork.ts'

export type ReferenceView = { label: string; artwork: Artwork; transparent: boolean; clothStart: number; clothEnd: number }
export type IllustrationMotion = 'breathing' | 'breeze'

// Only angles that actually exist in the supplied catalog are exposed.
// A single illustration is never presented as a complete 360 degree model.
export function referenceViews(garmentId: string): ReferenceView[] {
  const garment = garmentById(garmentId)
  if (garment.folk) return [{ label: 'Ảnh toàn thân', artwork: garment.artwork, transparent: true, clothStart: .28, clothEnd: garment.id === 'BD04' ? .9 : .83 }]
  if (garment.id === 'hac-phong') return [{ label: 'Ảnh nhân vật', artwork: { source: '/visuals/hac-phong-avatar.png', size: [1024, 1536], rect: [0, 0, 1024, 1536] }, transparent: true, clothStart: .355, clothEnd: .83 }]
  if (!garment.royal) return [{ label: 'Ảnh mẫu', artwork: garment.artwork, transparent: false, clothStart: .6, clothEnd: 1 }]
  return ['Mặt trước', 'Nghiêng trái', 'Nghiêng phải', 'Mặt sau'].map((label, i) => ({ label, artwork: catalogArtwork(garment.id, garment.gender, i), transparent: false, clothStart: catalogNeckline(garment.id, i), clothEnd: .91 }))
}

const channel = (hex: string) => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)) as [number, number, number]
const mix = (a: number, b: number, weight: number) => Math.round(a + (b - a) * Math.max(0, Math.min(1, weight)))

export function paletteTransform(outfit: Pick<Outfit, 'garmentId' | 'colorId'>) {
  const native = palettes.find(p => p.id === garmentProfiles[garmentById(outfit.garmentId).id].defaultColorId)!
  const selected = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  return { native: channel(native.colors[0]), primary: channel(selected.colors[0]), accent: channel(selected.colors[1]), unchanged: native.id === selected.id }
}

// Recolor fabric below the neckline; keep skin, hair and gold details intact.
// This is an image preview, not a physically based material simulation.
export function fabricPixel(rgb: readonly [number, number, number], y: number, view: ReferenceView, transform: ReturnType<typeof paletteTransform>): [number, number, number] {
  const [r, g, b] = rgb
  if (transform.unchanged || y < view.clothStart || y > view.clothEnd) return [r, g, b]
  const high = Math.max(r, g, b), low = Math.min(r, g, b)
  const nativeGold = transform.native[0] > 180 && transform.native[1] > 140
  const skin = r > 150 && g > 95 && b > 80 && r > g * 1.08 && g > b * 1.06
  const embroidery = !nativeGold && r > 150 && g > 115 && b < g * .83
  if (skin || low > 185 || embroidery) return [r, g, b]
  const saturation = high ? (high - low) / high : 0
  const darkFabric = high < 115 && saturation < .4
  const redFabric = r > g * 1.25 && r > b * 1.15 && r < 195
  const coloredFabric = saturation > .28 && (b > r * .9 || g > r * .93 || nativeGold && r > 135 && g > 75 && b < g * .7)
  if (!darkFabric && !redFabric && !coloredFabric) return [r, g, b]
  const target = redFabric && transform.native[0] < 45 ? transform.accent : transform.primary
  const light = darkFabric ? .38 + high / 140 : .38 + high / 280
  const blend = darkFabric ? .88 : .72
  return [mix(r, Math.min(255, target[0] * light), blend), mix(g, Math.min(255, target[1] * light), blend), mix(b, Math.min(255, target[2] * light), blend)]
}

export function illustrationFrame(seconds: number, motion: IllustrationMotion, moving: boolean, tilt: number) {
  const time = moving ? seconds : 0
  return {
    bob: moving ? Math.sin(time * 1.8) * 1.5 : 0,
    head: moving ? Math.sin(time * 1.15) * .8 : 0,
    cloth: moving ? Math.sin(time * 2.1) * (motion === 'breeze' ? 5 : 1.5) : 0,
    tilt: Math.max(-12, Math.min(12, tilt)),
  }
}
