import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isolateCatalogCharacter } from '../src/features/studio/segmentation.ts'

test('catalog viewer removes detached neighboring fragments and captions while preserving the main figure', () => {
  const width = 30, height = 40, pixels = new Uint8ClampedArray(width * height * 4).fill(255)
  const paint = (x, y, color) => pixels.set([...color, 255], (y * width + x) * 4)
  for (let y = 3; y < 30; y++) for (let x = 8; x < 19; x++) paint(x, y, [80, 35, 32])
  // Face and pale lining enclosed by the illustrated silhouette.
  paint(12, 7, [237, 162, 125]); paint(12, 22, [249, 245, 236])
  // A piece of the neighboring view and its dangling ornaments.
  for (let y = 8; y < 16; y++) paint(26, y, [169, 113, 40])
  // Caption below the character; gray outlines of the caption panel.
  for (let x = 8; x < 21; x++) paint(x, 35, [43, 24, 19])
  for (let x = 0; x < width; x++) paint(x, 38, [225, 225, 225])
  isolateCatalogCharacter(pixels, width, height)
  const alpha = (x, y) => pixels[(y * width + x) * 4 + 3]
  assert.equal(alpha(12, 7), 255)
  assert.equal(alpha(12, 22), 255)
  assert.equal(alpha(26, 10), 0)
  assert.equal(alpha(12, 35), 0)
  assert.equal(alpha(12, 38), 0)
})

test('diagonal fine ornament edges stay attached to the main character', () => {
  const width = 12, height = 12, pixels = new Uint8ClampedArray(width * height * 4).fill(255)
  for (let y = 4; y < 10; y++) for (let x = 4; x < 9; x++) pixels.set([45, 32, 27, 255], (y * width + x) * 4)
  for (let i = 0; i < 4; i++) pixels.set([210, 169, 78, 255], ((i + 1) * width + i + 1) * 4)
  isolateCatalogCharacter(pixels, width, height)
  assert.equal(pixels[(width + 1) * 4 + 3], 255)
  assert.equal(pixels[(9 * width + 8) * 4 + 3], 255)
})

test('large enclosed white backdrop near the head disappears without deleting eye highlights or pale lining', () => {
  const width = 40, height = 60, pixels = new Uint8ClampedArray(width * height * 4).fill(255)
  const paint = (x, y, color) => pixels.set([...color, 255], (y * width + x) * 4)
  for (let y = 3; y < 55; y++) for (let x = 8; x < 32; x++) paint(x, y, [70, 34, 27])
  for (let y = 12; y < 22; y++) for (let x = 22; x < 30; x++) paint(x, y, [255, 255, 255])
  paint(14, 9, [255, 255, 255])
  for (let y = 35; y < 47; y++) for (let x = 13; x < 21; x++) paint(x, y, [249, 245, 236])
  isolateCatalogCharacter(pixels, width, height)
  const alpha = (x, y) => pixels[(y * width + x) * 4 + 3]
  assert.equal(alpha(24, 17), 0)
  assert.equal(alpha(14, 9), 255)
  assert.equal(alpha(17, 40), 255)
  assert.equal(alpha(16, 18), 255)
})
