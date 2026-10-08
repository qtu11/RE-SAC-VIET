import { test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { commonerGarments, defaultOutfit, filterGarments, garmentById, parseOutfit } from '../src/features/studio/data.ts'
import { garmentProfiles, resolveWardrobe } from '../src/features/studio/wardrobe.ts'
import { referenceViews, paletteTransform, fabricPixel } from '../src/features/studio/reference.ts'
import { buildCharacter } from '../src/features/studio/three/character-model.ts'

test('commoner filters combine family, gender and Vietnamese search without including court dress', () => {
  assert.deepEqual(filterGarments('', 'Bình dân').map(g => g.id), ['BD01', 'BD02', 'BD03', 'BD04'])
  assert.deepEqual(filterGarments('ngu than', 'Bình dân', 'Nữ').map(g => g.id), ['BD02'])
  assert.deepEqual(filterGarments('Bac Bo', 'Bình dân').map(g => g.id), ['BD04'])
  assert.equal(filterGarments('', 'Cung đình').length, 15)
  for (const garment of commonerGarments) {
    assert.deepEqual(parseOutfit({ ...defaultOutfit, garmentId: garment.id })?.garmentId, garment.id)
    assert.equal(garment.royal, undefined)
    assert.ok(garment.history.details.length >= 3)
    assert.ok(garment.history.sources.every(s => new URL(s.url).hostname === 'svhttdl.hue.gov.vn'))
  }
  assert.ok(garmentById(defaultOutfit.garmentId).folk)
})

test('commoner artwork has real transparency and an uncropped full-body view with its native palette', async () => {
  for (const garment of commonerGarments) {
    const [view, ...extra] = referenceViews(garment.id)
    assert.equal(extra.length, 0)
    assert.equal(view.label, 'Ảnh toàn thân')
    assert.equal(view.transparent, true)
    assert.deepEqual(view.artwork.rect, [0, 0, 1024, 1536])
    const original = await readFile(new URL(`../asset/${garment.gender}/${garment.id}.png`, import.meta.url))
    const served = await readFile(new URL('../public' + view.artwork.source, import.meta.url))
    assert.deepEqual(original, served, 'the original asset and website image must stay synchronized')
    const image = sharp(fileURLToPath(new URL('../public' + view.artwork.source, import.meta.url)))
    const metadata = await image.metadata()
    assert.equal(metadata.hasAlpha, true)
    const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const alpha = (x, y) => data[(y * info.width + x) * info.channels + 3]
    // Generated PNGs may quantize a clear corner to alpha 1/255.
    assert.ok(alpha(0, 0) <= 1)
    assert.ok(alpha(info.width - 1, info.height - 1) <= 1)
    let top = info.height, bottom = 0, occupied = 0
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (alpha(x, y) > 200) { top = Math.min(top, y); bottom = Math.max(bottom, y); occupied++ }
    assert.ok(top > 5 && bottom < info.height - 5, 'hair and feet must have padding')
    assert.ok(bottom - top > info.height * .85, 'must show a full figure, not a face crop')
    assert.ok(occupied / (info.width * info.height) < .65, 'background must not be opaque')
    const transform = paletteTransform({ garmentId: garment.id, colorId: garmentProfiles[garment.id].defaultColorId })
    assert.equal(transform.unchanged, true)
    assert.deepEqual(fabricPixel([123, 86, 53], .6, view, transform), [123, 86, 53])
  }
})

test('plain experimental commoner meshes omit court motifs and distinguish the two garment constructions', () => {
  for (const garment of commonerGarments) {
    const outfit = { ...defaultOutfit, garmentId: garment.id, colorId: garmentProfiles[garment.id].defaultColorId }
    const wardrobe = resolveWardrobe(outfit)
    assert.equal(wardrobe.profile.motif, 'plain')
    assert.equal(wardrobe.ornaments, 0)
    const rig = buildCharacter(outfit)
    const bodice = rig.root.getObjectByName('garment-bodice')
    assert.equal(bodice.material.emissiveMap, null)
    assert.equal(rig.root.getObjectByName('ceremonial-medallion'), undefined)
    assert.equal(rig.root.getObjectByName('gold-hairpin'), undefined)
    const buttons = []
    rig.root.traverse(node => { if (node.name === 'fabric-button') buttons.push(node) })
    if (garment.id === 'BD04') {
      assert.equal(buttons.length, 0)
      assert.ok(rig.root.getObjectByName('tu-than-waist-tie'))
      assert.ok(rig.root.getObjectByName('yem'))
      assert.equal(rig.root.getObjectByName('inner-skirt').visible, true)
    } else {
      assert.equal(buttons.length, 5)
      assert.ok(buttons.every(button => button.material.metalness < .1))
      assert.ok(rig.root.getObjectByName('ngu-than-standing-collar'))
      assert.equal(rig.root.getObjectByName('inner-skirt').visible, false)
    }
    assert.ok(rig.root.getObjectByName('wooden-clog'))
    rig.dispose()
  }
})
