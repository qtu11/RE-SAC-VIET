import type { Outfit } from './data'
import { fabricPixel, illustrationFrame, paletteTransform, referenceViews } from './reference'
import type { IllustrationMotion, ReferenceView } from './reference'
import { isolateCatalogCharacter } from './segmentation'

const images = new Map<string, Promise<HTMLImageElement>>()
function loadImage(source: string) {
  const existing = images.get(source)
  if (existing) return existing
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => { images.delete(source); reject(new Error('Ảnh nhân vật chưa tải được.')) }
    image.src = source
  })
  images.set(source, pending)
  return pending
}

export type Illustration = { image: HTMLCanvasElement; reference: HTMLCanvasElement; view: ReferenceView }
export type IllustrationSelection = Pick<Outfit, 'garmentId' | 'colorId'>
const illustrations = new Map<string, Promise<Illustration>>()
export function illustrationKey(outfit: IllustrationSelection, viewIndex = 0) {
  return `${outfit.garmentId}:${outfit.colorId}:${Math.max(0, Math.min(referenceViews(outfit.garmentId).length - 1, viewIndex))}`
}

export function prepareIllustration(outfit: IllustrationSelection, viewIndex: number): Promise<Illustration> {
  const key = illustrationKey(outfit, viewIndex)
  const cached = illustrations.get(key)
  if (cached) return cached
  const pending = createIllustration(outfit, viewIndex).catch(error => { illustrations.delete(key); throw error })
  illustrations.set(key, pending)
  if (illustrations.size > 48) illustrations.delete(illustrations.keys().next().value!)
  return pending
}

async function createIllustration(outfit: IllustrationSelection, viewIndex: number): Promise<Illustration> {
  const views = referenceViews(outfit.garmentId)
  const view = views[Math.min(viewIndex, views.length - 1)]
  const source = await loadImage(view.artwork.source)
  const [x, y, w, h] = view.artwork.rect
  const reference = document.createElement('canvas')
  const scale = Math.min(1, 900 / h)
  reference.width = Math.round(w * scale); reference.height = Math.round(h * scale)
  const original = reference.getContext('2d', { willReadFrequently: true })!
  original.drawImage(source, x, y, w, h, 0, 0, reference.width, reference.height)
  if (view.artwork.source.startsWith('/catalog/') && !view.transparent) {
    const pixels = original.getImageData(0, 0, reference.width, reference.height)
    isolateCatalogCharacter(pixels.data, pixels.width, pixels.height, view.clothStart + .02); original.putImageData(pixels, 0, 0)
  }
  const image = document.createElement('canvas')
  image.width = reference.width; image.height = reference.height
  const context = image.getContext('2d', { willReadFrequently: true })!
  context.drawImage(reference, 0, 0)
  const transform = paletteTransform(outfit)
  if (!transform.unchanged) {
    const pixels = context.getImageData(0, 0, image.width, image.height)
    for (let row = 0; row < image.height; row++) {
      for (let col = 0; col < image.width; col++) {
        const i = (row * image.width + col) * 4
        if (pixels.data[i + 3] < 150) continue
        const rgb = fabricPixel([pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]], row / image.height, view, transform)
        pixels.data[i] = rgb[0]; pixels.data[i + 1] = rgb[1]; pixels.data[i + 2] = rgb[2]
      }
    }
    context.putImageData(pixels, 0, 0)
  }
  return { image, reference, view }
}

export function paintThumbnail(context: CanvasRenderingContext2D, illustration: Illustration, width: number, height: number) {
  context.clearRect(0, 0, width, height)
  const art = illustration.image
  const scale = Math.min(width * .92 / art.width, height * .96 / art.height)
  const w = art.width * scale, h = art.height * scale
  context.drawImage(art, (width - w) / 2, (height - h) / 2, w, h)
}

export function paintIllustration(context: CanvasRenderingContext2D, illustration: Illustration, width: number, height: number, seconds: number, motion: IllustrationMotion, moving: boolean, tilt: number, zoom: number, original: boolean, compact = false) {
  const art = original ? illustration.reference : illustration.image
  const frame = illustrationFrame(seconds, motion, moving && !original, original ? 0 : tilt)
  context.clearRect(0, 0, width, height)
  const photographic = illustration.view.artwork.source.startsWith('/visuals/reference-')
  const shownHeight = art.height
  const scale = Math.min(width * (photographic ? .85 : compact ? .94 : .96) / art.width, height * .95 / shownHeight) * zoom
  const drawWidth = art.width * scale, drawHeight = shownHeight * scale
  const left = (width - drawWidth) / 2, top = (height - drawHeight) / 2 + frame.bob
  // Continuous strip deformation preserves the original illustrated face.
  const stripHeight = 3
  for (let row = 0; row < shownHeight; row += stripHeight) {
    const y = row / art.height
    const headWeight = Math.max(0, 1 - y / illustration.view.clothStart)
    const clothWeight = Math.sin(Math.max(0, y - illustration.view.clothStart) * Math.PI / (1 - illustration.view.clothStart))
    const offset = frame.head * headWeight + frame.cloth * clothWeight + frame.tilt * Math.sin(y * Math.PI) * .45
    const count = Math.min(stripHeight, shownHeight - row)
    context.drawImage(art, 0, row, art.width, count, left + offset, top + row * scale, drawWidth, count * scale + .45)
  }
}
