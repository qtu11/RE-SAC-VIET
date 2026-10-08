import { garmentById, palettes } from './data.ts'
import type { Outfit } from './data.ts'

export type Silhouette = 'ngu-than' | 'nhat-binh' | 'tu-than' | 'ao-dai' | 'royal'
export type GarmentProfile = {
  silhouette: Silhouette
  defaultColorId: string
  motif: 'plain' | 'botanical' | 'phoenix' | 'dragon' | 'lotus'
  variant: number
  ceremonial: boolean
}

// One catalog entry maps to one garment design. Color is applied separately
// so changing a palette cannot silently swap the garment or the avatar.
export const garmentProfiles: Record<string, GarmentProfile> = {
  BD01: { silhouette: 'ngu-than', defaultColorId: 'nau-vai', motif: 'plain', variant: 10, ceremonial: false },
  BD02: { silhouette: 'ngu-than', defaultColorId: 'huyen', motif: 'plain', variant: 11, ceremonial: false },
  BD03: { silhouette: 'ngu-than', defaultColorId: 'cham-voi', motif: 'plain', variant: 12, ceremonial: false },
  BD04: { silhouette: 'tu-than', defaultColorId: 'nau-vai', motif: 'plain', variant: 13, ceremonial: false },
  'hac-phong': { silhouette: 'ngu-than', defaultColorId: 'huyen-do', motif: 'botanical', variant: 0, ceremonial: false },
  'ngu-than-nam': { silhouette: 'ngu-than', defaultColorId: 'huyen', motif: 'botanical', variant: 1, ceremonial: false },
  'nhat-binh-lam': { silhouette: 'nhat-binh', defaultColorId: 'lam-vang', motif: 'phoenix', variant: 0, ceremonial: false },
  'tu-than': { silhouette: 'tu-than', defaultColorId: 'ngoc', motif: 'lotus', variant: 0, ceremonial: false },
  'ao-dai': { silhouette: 'ao-dai', defaultColorId: 'hong', motif: 'botanical', variant: 0, ceremonial: false },
  P01: { silhouette: 'royal', defaultColorId: 'chu-kim', motif: 'phoenix', variant: 1, ceremonial: true },
  P02: { silhouette: 'royal', defaultColorId: 'chu-kim', motif: 'phoenix', variant: 2, ceremonial: true },
  P03: { silhouette: 'nhat-binh', defaultColorId: 'chu-kim', motif: 'phoenix', variant: 3, ceremonial: true },
  P04: { silhouette: 'nhat-binh', defaultColorId: 'kim', motif: 'phoenix', variant: 4, ceremonial: true },
  P05: { silhouette: 'nhat-binh', defaultColorId: 'chu-kim', motif: 'phoenix', variant: 5, ceremonial: true },
  P06: { silhouette: 'royal', defaultColorId: 'kim', motif: 'dragon', variant: 6, ceremonial: true },
  P07: { silhouette: 'nhat-binh', defaultColorId: 'chu-kim', motif: 'phoenix', variant: 7, ceremonial: true },
  P08: { silhouette: 'nhat-binh', defaultColorId: 'tim-bach', motif: 'phoenix', variant: 8, ceremonial: true },
  P09: { silhouette: 'nhat-binh', defaultColorId: 'tim-bach', motif: 'phoenix', variant: 9, ceremonial: true },
  M01: { silhouette: 'royal', defaultColorId: 'huyen-do', motif: 'dragon', variant: 1, ceremonial: true },
  M02: { silhouette: 'royal', defaultColorId: 'kim', motif: 'dragon', variant: 2, ceremonial: true },
  M03: { silhouette: 'royal', defaultColorId: 'lam-vang', motif: 'dragon', variant: 3, ceremonial: true },
  M04: { silhouette: 'royal', defaultColorId: 'chu-kim', motif: 'dragon', variant: 4, ceremonial: true },
  M05: { silhouette: 'ngu-than', defaultColorId: 'chu-kim', motif: 'dragon', variant: 5, ceremonial: true },
  M06: { silhouette: 'ngu-than', defaultColorId: 'lam-vang', motif: 'dragon', variant: 6, ceremonial: true },
}

export function resolveWardrobe(outfit: Outfit) {
  const garment = garmentById(outfit.garmentId)
  const profile = garmentProfiles[garment.id]
  const palette = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  return {
    garment, profile, palette,
    primary: palette.colors[0], accent: palette.colors[1],
    hem: outfit.style === 'Gen Z' ? .55 : outfit.style === 'Hiện đại' ? .37 : .2,
    sleeve: profile.motif === 'plain' ? .14 : profile.silhouette === 'nhat-binh' || profile.silhouette === 'royal' ? .34 : profile.silhouette === 'ao-dai' ? .13 : .23,
    ornaments: profile.motif === 'plain' ? 0 : profile.ceremonial ? 2 + profile.variant % 3 : 1,
  }
}

export type Pose = 'idle' | 'wave' | 'walk'
export function poseAt(pose: Pose, seconds: number, moving: boolean) {
  if (!moving) return { bob: 0, head: 0, leftArm: .08, rightArm: -.08, leftLeg: 0, rightLeg: 0, blink: 1 }
  const stride = Math.sin(seconds * 5)
  const blinking = seconds % 4.6
  return {
    bob: pose === 'walk' ? Math.abs(stride) * .035 : Math.sin(seconds * 1.8) * .012,
    head: Math.sin(seconds * 1.2) * .035,
    leftArm: pose === 'wave' ? 2.2 + Math.sin(seconds * 7) * .23 : pose === 'walk' ? stride * .2 : .08 + Math.sin(seconds * 1.6) * .035,
    rightArm: pose === 'walk' ? -stride * .2 : -.08 - Math.sin(seconds * 1.6) * .035,
    leftLeg: pose === 'walk' ? stride * .22 : 0,
    rightLeg: pose === 'walk' ? -stride * .22 : 0,
    blink: blinking > 4.35 ? Math.max(.07, Math.abs(blinking - 4.475) / .125) : 1,
  }
}
