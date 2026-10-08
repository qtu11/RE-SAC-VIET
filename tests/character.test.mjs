import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultOutfit, garments, palettes, accessories } from '../src/features/studio/data.ts'
import { garmentProfiles, poseAt } from '../src/features/studio/wardrobe.ts'
import { buildCharacter } from '../src/features/studio/three/character-model.ts'

test('every selectable garment has its own valid 3D wardrobe definition', () => {
  assert.deepEqual(Object.keys(garmentProfiles).sort(), garments.map(g => g.id).sort())
  for (const garment of garments) {
    assert.ok(palettes.some(p => p.id === garmentProfiles[garment.id].defaultColorId))
    const rig = buildCharacter({ ...defaultOutfit, garmentId: garment.id })
    const mesh = rig.root.getObjectByName('garment-bodice')
    assert.equal(mesh.userData.garmentId, garment.id)
    assert.ok(rig.root.getObjectByName('garment-skirt').geometry.attributes.position.count > 100)
    rig.dispose()
  }
})

test('changing any palette recolors the worn garment without changing its geometry or skin', () => {
  const base = { ...defaultOutfit, garmentId: 'hac-phong', colorId: 'huyen-do' }
  const reference = buildCharacter(base)
  const positions = Array.from(reference.root.getObjectByName('garment-skirt').geometry.attributes.position.array)
  const skin = reference.root.getObjectByName('visage').material.color.getHexString()
  for (const palette of palettes) {
    const rig = buildCharacter({ ...base, colorId: palette.id })
    assert.equal('#' + rig.root.getObjectByName('garment-bodice').material.color.getHexString(), palette.colors[0])
    assert.equal('#' + rig.root.getObjectByName('collar-left').material.color.getHexString(), palette.colors[1])
    assert.deepEqual(Array.from(rig.root.getObjectByName('garment-skirt').geometry.attributes.position.array), positions)
    assert.equal(rig.root.getObjectByName('visage').material.color.getHexString(), skin)
    rig.dispose()
  }
  reference.dispose()
})

test('garment families change actual collar, sleeve and skirt meshes', () => {
  const rigs = ['hac-phong', 'nhat-binh-lam', 'tu-than', 'ao-dai'].map(garmentId => buildCharacter({ ...defaultOutfit, garmentId }))
  assert.equal(rigs[0].root.getObjectByName('nhat-binh-square-collar'), undefined)
  assert.ok(rigs[1].root.getObjectByName('nhat-binh-square-collar'))
  assert.ok(rigs[2].root.getObjectByName('tu-than-front-panel'))
  assert.equal(rigs[3].root.getObjectByName('tu-than-front-panel'), undefined)
  assert.notEqual(rigs[1].root.getObjectByName('garment-sleeve').geometry.parameters.radiusBottom, rigs[3].root.getObjectByName('garment-sleeve').geometry.parameters.radiusBottom)
  assert.notEqual(rigs[0].root.getObjectByName('garment-skirt').geometry.parameters.radiusBottom, rigs[3].root.getObjectByName('garment-skirt').geometry.parameters.radiusBottom)
  rigs.forEach(r => r.dispose())
})

test('each accessory is attached to the body and appears only when selected', () => {
  for (const accessory of accessories) {
    const wearing = buildCharacter({ ...defaultOutfit, accessoryIds: [accessory.id] })
    const removed = buildCharacter({ ...defaultOutfit, accessoryIds: [] })
    for (const item of accessories) {
      assert.equal(wearing.root.getObjectByName('accessory-' + item.id).visible, item.id === accessory.id)
      assert.equal(removed.root.getObjectByName('accessory-' + item.id).visible, false)
    }
    const selected = wearing.root.getObjectByName('accessory-' + accessory.id)
    assert.ok(selected.parent)
    if (accessory.id === 'giay') {
      assert.ok(selected.userData.parts.every(boot => boot.visible && boot.parent))
      assert.ok(removed.root.getObjectByName('accessory-giay').userData.parts.every(boot => !boot.visible))
    } else assert.ok(selected.children.length > 0)
    wearing.dispose(); removed.dispose()
  }
})

test('wave, walk and blink move 3D joints rather than a flat image', () => {
  const rig = buildCharacter(defaultOutfit)
  rig.animate(0, 'idle', true)
  const hand = rig.root.getObjectByName('hand').parent
  const standing = hand.rotation.z
  rig.animate(.7, 'wave', true)
  assert.notEqual(hand.rotation.z, standing)
  const leg = rig.root.getObjectByName('trousers').parent
  rig.animate(.4, 'walk', true)
  const legAngle = leg.rotation.x
  rig.animate(.8, 'walk', true)
  assert.notEqual(leg.rotation.x, legAngle)
  rig.animate(4.475, 'idle', true)
  assert.ok(rig.root.getObjectByName('eye-white').parent.scale.y < .1)
  rig.animate(5, 'idle', true)
  assert.equal(rig.root.getObjectByName('eye-white').parent.scale.y, 1)
  assert.deepEqual(poseAt('walk', 10, false), poseAt('wave', 30, false))
  rig.dispose()
})

test('switching styles changes hem length and shoes while keeping the chosen palette', () => {
  const classic = buildCharacter({ ...defaultOutfit, style: 'Cổ điển', accessoryIds: ['giay'] })
  const genZ = buildCharacter({ ...defaultOutfit, style: 'Gen Z', accessoryIds: ['giay'] })
  assert.notEqual(classic.root.getObjectByName('garment-skirt').geometry.parameters.height, genZ.root.getObjectByName('garment-skirt').geometry.parameters.height)
  assert.notEqual(classic.root.getObjectByName('boot-shaft').geometry.parameters.height, genZ.root.getObjectByName('boot-shaft').geometry.parameters.height)
  assert.equal(classic.root.getObjectByName('garment-bodice').material.color.getHexString(), genZ.root.getObjectByName('garment-bodice').material.color.getHexString())
  classic.dispose(); genZ.dispose()
})

test('unmounted models release each allocated geometry and material exactly once', () => {
  const rig = buildCharacter(defaultOutfit)
  const resources = new Set()
  rig.root.traverse(object => {
    if (object.geometry) resources.add(object.geometry)
    if (object.material) resources.add(object.material)
  })
  const calls = new Map()
  for (const resource of resources) resource.addEventListener('dispose', () => calls.set(resource, (calls.get(resource) ?? 0) + 1))
  rig.dispose()
  assert.equal(calls.size, resources.size)
  assert.ok([...calls.values()].every(count => count === 1))
})
