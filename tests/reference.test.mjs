import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { defaultOutfit, garments, royalGarments, palettes } from '../src/features/studio/data.ts'
import { referenceViews, fabricPixel, paletteTransform, illustrationFrame } from '../src/features/studio/reference.ts'
import { catalogSheets } from '../src/features/studio/catalog-artwork.ts'

test('all catalog angles use actual supplied PNGs with crops inside image bounds', () => {
  for (const garment of garments) {
    const views = referenceViews(garment.id)
    assert.equal(views.length, garment.royal ? 4 : 1)
    for (const view of views) {
      const buffer = readFileSync(new URL('../public' + view.artwork.source, import.meta.url))
      const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20)
      const [x, y, w, h] = view.artwork.rect
      assert.ok(x >= 0 && y >= 0 && x + w <= width && y + h <= height, `${garment.id}: ${view.label}`)
    }
  }
  assert.deepEqual(referenceViews('hac-phong').map(v => v.label), ['Ảnh nhân vật'])
  for (const garment of royalGarments) assert.equal(referenceViews(garment.id)[3].label, 'Mặt sau')
})

test('palette preview changes dark fabric while protecting the face, hair, lining and embroidery', () => {
  const view = referenceViews('hac-phong')[0]
  for (const palette of palettes.filter(p => p.id !== 'huyen-do')) {
    const transform = paletteTransform({ garmentId: 'hac-phong', colorId: palette.id })
    assert.deepEqual(fabricPixel([45, 33, 28], .15, view, transform), [45, 33, 28])
    assert.deepEqual(fabricPixel([234, 163, 126], .4, view, transform), [234, 163, 126])
    assert.deepEqual(fabricPixel([230, 210, 195], .72, view, transform), [230, 210, 195])
    assert.deepEqual(fabricPixel([201, 161, 78], .65, view, transform), [201, 161, 78])
    assert.notDeepEqual(fabricPixel([35, 32, 33], .65, view, transform), [35, 32, 33])
  }
})

test('every royal card uses the same full-body front as the live preview, including every sheet size', () => {
  assert.equal(Object.keys(catalogSheets).length, 15)
  for (const garment of royalGarments) {
    const front = referenceViews(garment.id)[0].artwork
    assert.deepEqual(garment.artwork, front, garment.id)
    assert.deepEqual(garment.modelArtwork, front, garment.id)
    assert.ok(front.rect[0] < front.size[0] * .6, 'must use the outfit frame, not the face panel')
    assert.ok(front.rect[3] > front.rect[2] * 1.7, 'must include the crown, robe and hem')
  }
  assert.equal(garments.find(g => g.id === 'P06').subtitle, 'Cảm hứng thời Lý · Concept')
})

test('selecting the native palette preserves original pixels, and gold fabric can become blue', () => {
  for (const rgb of [[12, 12, 18], [148, 26, 34], [220, 150, 72], [234, 163, 126]]) {
    assert.deepEqual(fabricPixel(rgb, .6, referenceViews('hac-phong')[0], paletteTransform({ garmentId: 'hac-phong', colorId: 'huyen-do' })), rgb)
  }
  const blue = fabricPixel([220, 150, 72], .6, referenceViews('P04')[0], paletteTransform({ ...defaultOutfit, garmentId: 'P04', colorId: 'lam-vang' }))
  assert.ok(blue[2] > blue[0], 'gold garment fabric visibly switches to the chosen blue palette')
})

test('tall ceremonial hats have their own neckline so palette changes do not recolor the lower face or hair', () => {
  for (const id of ['M01', 'M02', 'M03', 'M04', 'M05', 'M06']) {
    const transform = paletteTransform({ garmentId: id, colorId: 'ngoc' })
    for (const view of referenceViews(id)) {
      assert.deepEqual(fabricPixel([35, 32, 33], view.clothStart - .01, view, transform), [35, 32, 33])
      assert.notDeepEqual(fabricPixel([35, 32, 33], .65, view, transform), [35, 32, 33])
    }
  }
  assert.ok(referenceViews('M03')[2].clothStart > referenceViews('P07')[2].clothStart)
})

test('illustration motion changes frames, respects pause and bounds a single-image tilt', () => {
  const first = illustrationFrame(1, 'breeze', true, 8)
  assert.notDeepEqual(first, illustrationFrame(2, 'breeze', true, 8))
  assert.deepEqual(illustrationFrame(1, 'breathing', false, 8), illustrationFrame(900, 'breeze', false, 8))
  assert.equal(illustrationFrame(1, 'breathing', true, 360).tilt, 12)
  assert.equal(illustrationFrame(1, 'breathing', true, -360).tilt, -12)
})
