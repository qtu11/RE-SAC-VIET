import type { Artwork } from './data'

type CatalogSheet = { size: readonly [number, number]; views: readonly Artwork['rect'][] }
const femaleViews: CatalogSheet['views'] = [[650, 9, 182, 395], [834, 9, 146, 395], [981, 9, 154, 395], [1137, 9, 163, 395]]

// Frames measured from each supplied sheet include the crown and hem, above captions.
// Cards and the live viewer share these exact frames.
export const catalogSheets: Record<string, CatalogSheet> = {
  P01: { size: [1536, 1024], views: [[650, 9, 184, 395], [835, 9, 145, 395], [981, 9, 155, 395], [1137, 9, 161, 395]] },
  P02: { size: [1536, 1024], views: [[680, 13, 158, 379], [839, 13, 139, 379], [985, 13, 155, 379], [1141, 13, 158, 379]] },
  P03: { size: [1536, 1024], views: femaleViews },
  P04: { size: [1672, 941], views: [[687, 9, 205, 373], [893, 9, 160, 373], [1054, 9, 169, 373], [1224, 9, 177, 373]] },
  P05: { size: [1536, 1024], views: femaleViews },
  P06: { size: [1536, 1024], views: femaleViews },
  P07: { size: [1672, 941], views: [[683, 9, 185, 386], [869, 9, 147, 386], [1017, 9, 153, 386], [1170, 9, 185, 386]] },
  P08: { size: [1536, 1024], views: femaleViews },
  P09: { size: [1536, 1024], views: femaleViews },
  M01: { size: [1536, 1024], views: [[677, 9, 168, 401], [851, 9, 146, 401], [1004, 9, 147, 401], [1153, 9, 145, 401]] },
  M02: { size: [1448, 1086], views: [[602, 39, 163, 387], [775, 39, 141, 387], [922, 39, 150, 387], [1055, 39, 168, 387]] },
  M03: { size: [1448, 1086], views: [[582, 41, 161, 358], [744, 41, 151, 358], [898, 41, 150, 358], [1048, 41, 158, 358]] },
  M04: { size: [1536, 1024], views: [[652, 9, 207, 397], [860, 9, 174, 397], [1035, 9, 121, 397], [1157, 9, 143, 397]] },
  M05: { size: [1536, 1024], views: [[710, 9, 168, 391], [880, 9, 142, 391], [1024, 9, 145, 391], [1170, 9, 128, 391]] },
  M06: { size: [1536, 1024], views: [[691, 9, 171, 395], [864, 9, 139, 395], [1004, 9, 147, 395], [1153, 9, 146, 395]] },
}

// Tall ceremonial hats move the face and neckline lower in the frame.
// Keep recoloring and enclosed-backdrop cleanup below each actual neckline.
const necklines: Record<string, readonly number[]> = {
  M01: [.39, .4, .4, .4], M02: [.43, .43, .43, .44],
  M03: [.46, .48, .49, .5], M04: [.39, .4, .4, .4],
  M05: [.4, .42, .42, .42], M06: [.4, .4, .4, .4],
  P04: [.36, .38, .38, .4], P07: [.36, .38, .38, .4],
}

export function catalogNeckline(id: string, viewIndex: number) {
  return (necklines[id] ?? [.365, .38, .38, .4])[viewIndex]
}

export function catalogArtwork(id: string, gender: 'Nam' | 'Nữ', viewIndex = 0): Artwork {
  const sheet = catalogSheets[id]
  return { source: `/catalog/${gender}/${id}.png`, size: sheet.size, rect: sheet.views[Math.max(0, Math.min(3, Math.trunc(viewIndex)))] }
}
