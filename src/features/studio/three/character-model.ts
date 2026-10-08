import * as THREE from 'three'
import type { Outfit } from '../data.ts'
import { poseAt, resolveWardrobe } from '../wardrobe.ts'
import type { Pose } from '../wardrobe.ts'

type Material = THREE.MeshStandardMaterial
type Point = readonly [number, number, number]
export type CharacterRig = {
  root: THREE.Group
  animate: (seconds: number, pose: Pose, moving: boolean) => void
  dispose: () => void
}

const materials = (color: string, metallic = false) => new THREE.MeshStandardMaterial({ color, roughness: metallic ? .29 : .69, metalness: metallic ? .7 : .02 })

function ellipsoid(parent: THREE.Object3D, name: string, material: Material, position: Point, scale: Point) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), material)
  mesh.name = name
  mesh.position.set(...position)
  mesh.scale.set(...scale)
  mesh.castShadow = true
  parent.add(mesh)
  return mesh
}

function tube(parent: THREE.Object3D, name: string, material: Material, points: Point[], radius = .018) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, radius, 6, false), material)
  mesh.name = name
  mesh.castShadow = true
  parent.add(mesh)
  return mesh
}

function cylinder(parent: THREE.Object3D, name: string, material: Material, top: number, bottom: number, height: number, position: Point, depth = 1) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 40, 6), material)
  mesh.name = name
  mesh.position.set(...position)
  mesh.scale.z = depth
  mesh.castShadow = true
  parent.add(mesh)
  return mesh
}

function box(parent: THREE.Object3D, name: string, material: Material, size: Point, position: Point) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  mesh.name = name
  mesh.position.set(...position)
  mesh.castShadow = true
  parent.add(mesh)
  return mesh
}

function flower(parent: THREE.Object3D, material: Material, at: Point, size = .08) {
  const group = new THREE.Group()
  group.position.set(...at)
  parent.add(group)
  for (let p = 0; p < 5; p++) {
    const angle = p / 5 * Math.PI * 2
    const petal = ellipsoid(group, 'cánh hoa', material, [Math.cos(angle) * size * .6, Math.sin(angle) * size * .6, 0], [size * .5, size * .26, size * .19])
    petal.rotation.z = angle
  }
  ellipsoid(group, 'nhụy hoa', material, [0, 0, .02], [size * .23, size * .23, size * .23])
  return group
}

function embroidery(motif: string, variant: number) {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = '#eaca89'
  ctx.fillStyle = '#aa793f'
  ctx.lineWidth = 2
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
    const x = 30 + col * 140 + (row % 2) * 18
    const y = 38 + row * 140
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((variant % 3 - 1) * .18)
    ctx.beginPath()
    ctx.moveTo(-24, 50)
    ctx.bezierCurveTo(24, 36, -25, -24, 35, -42)
    ctx.stroke()
    for (let i = 0; i < 6; i++) {
      ctx.save()
      ctx.translate(Math.sin(i) * 17, 32 - i * 12)
      ctx.rotate(i * .7)
      ctx.beginPath()
      ctx.ellipse(8, 0, 13, 4, .3, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }
    for (let i = 0; i < 5; i++) {
      ctx.save()
      ctx.translate(22, -36)
      ctx.rotate(i * Math.PI * .4)
      ctx.beginPath()
      ctx.ellipse(9, 0, 11, 5, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    if (motif === 'dragon' || motif === 'phoenix') {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(2, 18)
        ctx.bezierCurveTo(50, 45, 65, -55 + i * 9, 12, -10)
        ctx.stroke()
      }
    }
    ctx.restore()
  }
  for (const y of [8, 490]) {
    ctx.strokeRect(0, y, 512, 8)
    for (let x = 0; x < 512; x += 16) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 8, y + 8); ctx.lineTo(x + 16, y); ctx.stroke() }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

function robeGeometry(topRadius: number, bottomRadius: number, height: number, open = false, folds = 12) {
  const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 64, 14, true, open ? .2 : 0, open ? Math.PI * 2 - .4 : Math.PI * 2)
  const vertices = geometry.attributes.position
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i)
    const fold = 1 + Math.sin(Math.atan2(x, z) * folds) * .033 * (height / 2 - y) / height
    vertices.setXYZ(i, x * fold, y, z * fold * .63)
  }
  geometry.computeVertexNormals()
  return geometry
}

export function disposeObject(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), mats = new Set<THREE.Material>(), textures = new Set<THREE.Texture>()
  root.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    geometries.add(node.geometry)
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      mats.add(material)
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
    }
  })
  geometries.forEach(g => g.dispose())
  mats.forEach(m => m.dispose())
  textures.forEach(t => t.dispose())
}

export function buildCharacter(outfit: Outfit): CharacterRig {
  const design = resolveWardrobe(outfit)
  const { garment, profile, primary, accent } = design
  const root = new THREE.Group()
  root.name = garment.id
  const body = new THREE.Group(), head = new THREE.Group(), leftArm = new THREE.Group(), rightArm = new THREE.Group()
  const leftLeg = new THREE.Group(), rightLeg = new THREE.Group()
  root.add(body, leftLeg, rightLeg)
  body.add(head, leftArm, rightArm)
  head.position.y = 2.78
  leftArm.position.set(.39, 1.98, 0)
  rightArm.position.set(-.39, 1.98, 0)
  leftLeg.position.set(.19, .65, 0)
  rightLeg.position.set(-.19, .65, 0)

  const skin = materials('#f2c7b0'), hair = materials('#211717'), hairLight = materials('#392421')
  const gold = materials('#d6b16f', true), white = materials('#fff1e0'), dark = materials('#16171e'), pink = materials('#dd7883')
  const main = materials(primary), secondary = materials(accent)
  main.side = secondary.side = THREE.DoubleSide
  const pattern = profile.motif === 'plain' ? null : embroidery(profile.motif, profile.variant)
  if (pattern) { main.emissiveMap = pattern; main.emissive.set('#efc16a'); main.emissiveIntensity = .75 }

  ellipsoid(head, 'visage', skin, [0, 0, 0], [.64, .7, .55])
  ellipsoid(head, 'ear-left', skin, [.61, -.02, 0], [.12, .17, .08])
  ellipsoid(head, 'ear-right', skin, [-.61, -.02, 0], [.12, .17, .08])
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.67, 40, 28, 0, Math.PI * 2, 0, 1.7), hair)
  cap.name = 'hair'; cap.position.y = .12; cap.scale.set(1.05, 1.12, .92); cap.castShadow = true; head.add(cap)
  ellipsoid(head, 'hair-back', hair, [0, -.1, -.35], [.57, .58, .28])
  if (garment.gender === 'Nữ') {
    for (let i = 0; i < 5; i++) {
      const bun = ellipsoid(head, 'hair-bun', i % 2 ? hair : hairLight, [Math.sin(i * 1.4) * .18, .58 + i * .055, -.21 - Math.cos(i) * .08], [.31, .22, .28])
      bun.rotation.z = i * .55
    }
  }
  const bangs = ellipsoid(head, 'fringe-swept', hair, [-.18, .34, .43], [.49, .19, .11]); bangs.rotation.z = .47
  const sideBangs = ellipsoid(head, 'fringe-side', hairLight, [.48, .06, .31], [.12, .39, .14]); sideBangs.rotation.z = .2
  const otherBangs = ellipsoid(head, 'fringe-side-left', hair, [-.54, -.04, .25], [.105, .38, .14]); otherBangs.rotation.z = -.17
  for (let i = 0; i < 5; i++) tube(head, 'hair-strand', hairLight, [[-.5 + i * .13, .36 + i * .025, .47], [-.21 + i * .14, .46, .5], [.25 + i * .055, .57, .31]], .009)

  const eyes: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    eye.position.set(side * .245, -.035, .475)
    eye.rotation.y = side * .16
    head.add(eye); eyes.push(eye)
    ellipsoid(eye, 'eye-white', white, [0, 0, 0], [.196, .225, .071])
    const iris = materials('#7d4227')
    ellipsoid(eye, 'iris', iris, [-side * .012, -.003, .057], [.13, .175, .035])
    ellipsoid(eye, 'pupil', dark, [-side * .014, .004, .083], [.074, .135, .018])
    ellipsoid(eye, 'eye-highlight', white, [-.042, .085, .099], [.041, .049, .012])
    ellipsoid(eye, 'eye-highlight-small', white, [.058, -.07, .097], [.017, .023, .01])
    tube(eye, 'upper-lashes', hair, [[-.18, .03, .06], [-.1, .205, .048], [.1, .19, .05], [.185, .06, .045]], .017)
    for (let n = 0; n < 3; n++) tube(eye, 'lash', hair, [[side * (.14 + n * .012), .115 + n * .025, .06], [side * (.22 + n * .01), .17 + n * .035, .055]], .012)
    const brow = tube(head, 'eyebrow', hairLight, [[side * .11, .28, .5], [side * .25, .315, .48], [side * .38, .265, .43]], .018)
    brow.rotation.z = side * -.07
    const blush = materials('#ec9b91'); blush.transparent = true; blush.opacity = .42
    ellipsoid(head, 'blush', blush, [side * .37, -.245, .436], [.135, .065, .016])
  }
  ellipsoid(head, 'nose', skin, [0, -.23, .547], [.054, .05, .06])
  ellipsoid(head, 'lips', pink, [0, -.395, .436], [.068, .032, .018])
  ellipsoid(body, 'neck', skin, [0, 2.09, 0], [.12, .23, .12])

  for (const leg of [leftLeg, rightLeg]) {
    cylinder(leg, 'trousers', garment.id === 'BD02' ? materials('#72543c') : white, .15, .14, .56, [0, -.13, 0], .92)
    ellipsoid(leg, 'bare-foot', skin, [0, -.5, .07], [.14, .085, .19])
  }
  const torso = ellipsoid(body, 'garment-bodice', main, [0, 1.78, 0], [.4, .42, .25])
  torso.userData.garmentId = garment.id
  const hem = profile.ceremonial ? .12 : design.hem + (garment.folk && profile.silhouette === 'ngu-than' ? .13 : 0)
  const robeHeight = 1.5 - hem
  const skirt = new THREE.Mesh(robeGeometry(.33, garment.folk && profile.silhouette === 'ngu-than' ? .47 : profile.silhouette === 'ao-dai' ? .44 : profile.silhouette === 'royal' ? .85 : .64, robeHeight, profile.silhouette === 'tu-than', 12 + profile.variant), main)
  skirt.name = 'garment-skirt'; skirt.position.y = hem + robeHeight / 2; skirt.castShadow = true; body.add(skirt)
  const innerHem = Math.max(.12, hem - .12)
  const innerHeight = 1.4 - innerHem
  const inner = new THREE.Mesh(robeGeometry(.27, .49, innerHeight, false, 20), garment.folk ? dark : white)
  inner.name = 'inner-skirt'; inner.position.y = innerHem + innerHeight / 2; body.add(inner)
  inner.visible = !(garment.folk && profile.silhouette === 'ngu-than')
  if (profile.silhouette === 'ao-dai') inner.scale.z = .7

  const lapelWidth = profile.silhouette === 'nhat-binh' ? .15 : .07
  if (garment.folk && profile.silhouette === 'ngu-than') {
    cylinder(body, 'ngu-than-standing-collar', main, .145, .16, .15, [0, 2.13, .015], .82)
    tube(body, 'ngu-than-overlap', main, [[0, 2.12, .16], [-.25, 1.96, .22], [-.31, 1.7, .22], [-.31, .55, .27]], .01)
  } else {
    tube(body, 'collar-left', garment.folk ? main : secondary, [[-.13, 2.13, .1], [-.23, 1.99, .22], [-.07, 1.69, .25], [-.07, .55, .38]], lapelWidth / 2)
    tube(body, 'collar-right', garment.folk ? main : secondary, [[.13, 2.13, .1], [.23, 1.99, .22], [.07, 1.69, .25], [.07, .55, .38]], lapelWidth / 2)
  }
  if (profile.silhouette === 'nhat-binh') {
    box(body, 'nhat-binh-square-collar', secondary, [.49, .13, .04], [0, 1.78, .26])
    box(body, 'nhat-binh-apron', secondary, [.22, .7, .05], [0, 1.09, .29])
    for (const y of [1.24, .97]) flower(body, gold, [0, y, .34], .09)
  } else if (profile.silhouette === 'tu-than') {
    box(body, 'yem', secondary, [.23, .37, .03], [0, 1.68, .26])
    for (const side of [-1, 1]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(.16, 1.07, 4, 12), garment.folk ? main : secondary)
      panel.name = 'tu-than-front-panel'; panel.position.set(side * .2, 1.02, .35); panel.rotation.z = side * -.1; body.add(panel)
    }
    if (garment.folk) {
      tube(body, 'tu-than-waist-tie', main, [[-.25, 1.47, .24], [0, 1.44, .3], [.25, 1.47, .24]], .025)
      tube(body, 'tu-than-tied-fronts', main, [[-.05, 1.45, .3], [.08, 1.34, .32], [0, 1.13, .36]], .035)
    }
  } else if (garment.folk) {
    const closures: Point[] = [[.015, 2.14, .15], [-.11, 2.07, .19], [-.25, 1.94, .22], [-.3, 1.81, .23], [-.31, 1.68, .23]]
    for (const point of closures) ellipsoid(body, 'fabric-button', main, point, [.018, .018, .016])
  } else {
    for (let i = 0; i < 5; i++) ellipsoid(body, 'five-buttons', gold, [.18, 1.92 - i * .105, .246], [.022, .022, .015])
  }
  if (profile.ceremonial) {
    const medallion = cylinder(body, 'ceremonial-medallion', gold, .15, .15, .02, [0, 1.91, .27])
    medallion.rotation.x = Math.PI / 2
    flower(body, secondary, [0, 1.91, .295], .1)
  }
  for (const [arm, side] of [[leftArm, 1], [rightArm, -1]] as const) {
    const sleeve = cylinder(arm, 'garment-sleeve', main, .17, design.sleeve, .69, [side * .075, -.33, 0], .79)
    sleeve.rotation.z = side * .19
    cylinder(arm, 'sleeve-border', garment.folk ? main : secondary, design.sleeve, design.sleeve * 1.03, .065, [side * .145, -.655, 0], .79)
    ellipsoid(arm, 'hand', skin, [side * .14, -.77, .055], [.085, .13, .09])
  }
  const accessoryObjects = new Map<string, THREE.Object3D>()
  function wearable(id: string, parent: THREE.Object3D) {
    const group = new THREE.Group(); group.name = `accessory-${id}`; parent.add(group); accessoryObjects.set(id, group); return group
  }
  const hat = wearable('khan', head)
  const wrapMaterial = garment.folk ? garment.id === 'BD04' ? dark : main : secondary
  const hatBand = cylinder(hat, 'headwrap', wrapMaterial, .62, .65, .17, [0, .3, 0], .97)
  hatBand.rotation.x = -.04
  if (garment.folk) {
    for (let i = 0; i < 3; i++) cylinder(hat, 'cloth-wrap-fold', wrapMaterial, .6 - i * .02, .64 - i * .02, .055, [0, .35 + i * .055, 0], .94)
  } else if (garment.gender === 'Nam') cylinder(hat, 'hat', dark, .57, .59, .32, [0, .52, 0], .88)
  else {
    for (let i = 0; i < design.ornaments + 3; i++) {
      const x = -.5 + i * .2
      tube(hat, 'gold-hairpin', gold, [[x, .39, .32], [x * .9, .6, .29], [x * 1.1, .71, .25]], .012)
      flower(hat, gold, [x * 1.1, .72, .25], .058)
    }
    for (const side of [-1, 1]) flower(hat, gold, [side * .56, .26, .24], .12)
  }

  const jewelry = wearable('trang-suc', head)
  for (const side of [-1, 1]) {
    tube(jewelry, 'earring-chain', gold, [[side * .6, -.12, .02], [side * .63, -.3, .05], [side * .62, -.49, .06]], .01)
    ellipsoid(jewelry, 'earring-pearl', gold, [side * .62, -.49, .06], [.036, .055, .032])
    tube(jewelry, 'hair-tassel', gold, [[side * .53, .4, .2], [side * .61, .07, .22], [side * .65, -.27, .2]], .012)
    const tassel = cylinder(jewelry, 'tassel', secondary, .025, .043, .29, [side * .65, -.41, .2])
    tassel.rotation.z = side * .06
    flower(jewelry, gold, [side * .54, .4, .22], .085)
  }

  const belt = wearable('dai', body)
  cylinder(belt, 'belt', secondary, .362, .383, .11, [0, 1.44, 0], .67)
  flower(belt, gold, [0, 1.44, .28], .075)
  tube(belt, 'belt-sash', secondary, [[.13, 1.44, .28], [.27, 1.05, .36], [.31, .65, .34]], .038)

  const fan = wearable('quat', leftArm)
  fan.position.set(.09, -.65, .16); fan.rotation.set(.1, -.15, -.72)
  const fanShape = new THREE.Shape(); fanShape.moveTo(0, 0)
  for (let i = 0; i <= 32; i++) { const a = .2 + i / 32 * 2.7; fanShape.lineTo(Math.cos(a) * .42, Math.sin(a) * .42) }
  fanShape.lineTo(0, 0)
  const fanMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(fanShape, { depth: .015, bevelEnabled: false }), secondary)
  fanMesh.name = 'fan-leaf'; fan.add(fanMesh)
  for (let i = 0; i < 12; i++) { const a = .2 + i / 11 * 2.7; tube(fan, 'fan-rib', gold, [[0, 0, .018], [Math.cos(a) * .42, Math.sin(a) * .42, .018]], .006) }

  const bag = wearable('tui', rightArm)
  bag.position.set(-.14, -.96, .12)
  ellipsoid(bag, 'handbag', secondary, [0, -.06, 0], [.18, .17, .095])
  tube(bag, 'bag-handle', gold, [[-.12, .03, 0], [-.08, .2, 0], [.08, .2, 0], [.12, .03, 0]], .012)
  flower(bag, gold, [0, -.06, .09], .055)

  const shoes = wearable('giay', root)
  for (const [leg, x] of [[leftLeg, .19], [rightLeg, -.19]] as const) {
    const shoe = new THREE.Group(); shoe.name = 'boot'; leg.add(shoe)
    if (garment.folk && outfit.style === 'Cổ điển') {
      box(shoe, 'wooden-clog', materials('#8b6240'), [.29, .07, .43], [0, -.56, .08])
      tube(shoe, 'clog-strap', dark, [[-.13, -.48, .13], [0, -.4, .14], [.13, -.48, .13]], .024)
    }
    const bootMaterial = outfit.style === 'Cổ điển' ? secondary : dark
    ellipsoid(shoe, 'shoe-toe', bootMaterial, [0, -.48, .1], [.17, .12, .255])
    cylinder(shoe, 'boot-shaft', bootMaterial, .145, .16, outfit.style === 'Cổ điển' ? .12 : .43, [0, -.3, 0], .9)
    box(shoe, 'shoe-sole', dark, [.31, .07, .43], [0, -.58, .07])
    if (outfit.style !== 'Cổ điển') {
      for (let i = 0; i < 3; i++) tube(shoe, 'boot-lace', gold, [[-.09, -.32 - i * .05, .126], [.09, -.32 - i * .05, .126]], .008)
    }
    if (garment.folk && outfit.style === 'Cổ điển') {
      for (const name of ['shoe-toe', 'boot-shaft', 'shoe-sole']) shoe.getObjectByName(name)!.visible = false
    }
    shoe.userData.side = x
    shoes.userData.parts = [...(shoes.userData.parts ?? []), shoe]
  }
  for (const [id, object] of accessoryObjects) {
    object.visible = outfit.accessoryIds.includes(id)
    if (id === 'giay') for (const part of object.userData.parts as THREE.Group[]) part.visible = object.visible
  }
  if (profile.ceremonial) {
    const emblem = flower(head, gold, [0, .78, .04], .115)
    emblem.name = 'ceremonial-emblem'
  }

  return {
    root,
    animate(seconds, pose, moving) {
      const motion = poseAt(pose, seconds, moving)
      body.position.y = motion.bob
      head.rotation.z = motion.head
      leftArm.rotation.z = motion.leftArm
      rightArm.rotation.z = motion.rightArm
      leftLeg.rotation.x = motion.leftLeg
      rightLeg.rotation.x = motion.rightLeg
      for (const eye of eyes) eye.scale.y = motion.blink
      jewelry.rotation.z = moving ? Math.sin(seconds * 1.8) * .023 : 0
      skirt.rotation.z = moving ? Math.sin(seconds * 1.8) * .012 : 0
    },
    dispose: () => disposeObject(root),
  }
}
