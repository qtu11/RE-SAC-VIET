import { accessories, garments, occasions, palettes, styles } from '@/features/studio/data'
import { garmentProfiles } from '@/features/studio/wardrobe'
import { referenceViews } from '@/features/studio/reference'

export function GET() {
  return Response.json({ garments, palettes, accessories, occasions, styles, wardrobeProfiles: garmentProfiles, referenceViews: Object.fromEntries(garments.map(g => [g.id, referenceViews(g.id)])), viewer: { default: 'illustration-2.5d', matching3dAsset: null, experimental3d: true } }, { headers: { 'Cache-Control': 'public, max-age=300' } })
}
