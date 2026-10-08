import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { defaultOutfit, parseOutfit, outfitKey, getInitialOutfit, garments, palettes, accessories, occasions, looks, searchGarments } from '../src/features/studio/data.ts'

test('shared outfit rejects unknown selections and incomplete payloads', () => {
  for (const value of [null, [], 'outfit', {}, { ...defaultOutfit, garmentId: '../private' }, { ...defaultOutfit, style: 'unknown' }, { ...defaultOutfit, colorId: '<script>' }, { ...defaultOutfit, occasionId: 'unknown' }, { ...defaultOutfit, accessoryIds: null }]) assert.equal(parseOutfit(value), null)
})

test('accessory inputs are restricted to the catalog and deduplicated', () => {
  const parsed = parseOutfit({ ...defaultOutfit, accessoryIds: ['quat', 'unknown', 'quat', 123, null, 'tui'] })
  assert.deepEqual(parsed.accessoryIds, ['quat', 'tui'])
})

test('saving the same outfit after a reload or reordering accessories is idempotent', () => {
  const restored = parseOutfit(JSON.parse(JSON.stringify(defaultOutfit)))
  assert.equal(outfitKey(restored), outfitKey(defaultOutfit))
  assert.equal(outfitKey({ ...restored, accessoryIds: [...restored.accessoryIds].reverse() }), outfitKey(defaultOutfit))
  assert.notEqual(outfitKey({ ...restored, colorId: 'tim-bach' }), outfitKey(defaultOutfit))
})

test('damaged local data recovers to a usable default outfit', () => {
  globalThis.location = { search: '' }
  globalThis.localStorage = { getItem: () => '{broken-json' }
  assert.deepEqual(getInitialOutfit(), defaultOutfit)
  globalThis.localStorage = { getItem: () => { throw new Error('Storage disabled') } }
  assert.deepEqual(getInitialOutfit(), defaultOutfit)
})

test('a valid shared link restores all choices before considering local data', () => {
  const shared = { ...defaultOutfit, colorId: 'lam-vang', occasionId: 'tet', accessoryIds: ['tui'] }
  globalThis.location = { search: `?look=${encodeURIComponent(JSON.stringify(shared))}` }
  globalThis.localStorage = { getItem: () => JSON.stringify(defaultOutfit) }
  assert.deepEqual(getInitialOutfit(), parseOutfit(shared))
  globalThis.location = { search: '?look=invalid' }
  assert.deepEqual(getInitialOutfit(), defaultOutfit)
})

test('catalog IDs are unique and campaign presets use available palettes', () => {
  for (const catalog of [garments, palettes, accessories, occasions, looks]) assert.equal(new Set(catalog.map(item => item.id)).size, catalog.length)
  for (const look of looks) assert.ok(palettes.some(p => p.id === look.colorId))
  assert.equal(garments.filter(g => g.royal).length, 15)
})

test('Vietnamese search accepts accents, unaccented input, and capitalization', () => {
  assert.deepEqual(searchGarments('  NHAT BINH  ').map(g => g.id), searchGarments('nhật bình').map(g => g.id))
  assert.ok(searchGarments('ngu than').some(g => g.id === 'ngu-than-nam'))
  assert.deepEqual(searchGarments('khong-co-mau-nao'), [])
  assert.deepEqual(searchGarments('P07').map(g => g.id), ['P07'])
  assert.equal(searchGarments('cung dinh').filter(g => g.royal).length, 15)
})

test('every visible artwork references a real PNG and a crop within its bounds', async () => {
  const artwork = [...garments.map(g => g.artwork), ...garments.filter(g => g.modelArtwork).map(g => g.modelArtwork), ...palettes.map(p => p.artwork), ...accessories.map(a => a.artwork), ...occasions.map(o => o.artwork), ...looks.map(l => l.image)]
  for (const art of artwork) {
    const file = await readFile(new URL(`../public${art.source}`, import.meta.url))
    const width = file.readUInt32BE(16)
    const height = file.readUInt32BE(20)
    const [x, y, cropWidth, cropHeight] = art.rect
    assert.ok(x >= 0 && y >= 0 && cropWidth > 0 && cropHeight > 0 && x + cropWidth <= width && y + cropHeight <= height, `Invalid crop: ${art.source}`)
    assert.deepEqual(art.size ?? [1536, 1024], [width, height], `Wrong dimensions: ${art.source}`)
  }
})
