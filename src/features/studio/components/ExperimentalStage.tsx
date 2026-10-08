'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Hand, Move3D, Pause, PersonStanding, Play, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { accessories, garmentById, occasions, outfitName, palettes } from '../data'
import type { Outfit } from '../data'
import { buildCharacter, disposeObject } from '../three/character-model'
import type { CharacterRig } from '../three/character-model'
import type { Pose } from '../wardrobe'
import './character.css'

type StageController = {
  setOutfit: (outfit: Outfit) => void
  rotate: (radians: number) => void
  zoom: (amount: number) => void
  reset: () => void
  capture: () => void
}

export default function CharacterStage({ outfit, compact = false, active = true }: { outfit: Outfit; compact?: boolean; active?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<StageController | null>(null)
  const selection = useRef(outfit)
  const activeRef = useRef(active)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [moving, setMoving] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [rotating, setRotating] = useState(false)
  const [pose, setPose] = useState<Pose>('idle')
  const [angle, setAngle] = useState(0)
  const [captureMessage, setCaptureMessage] = useState('')
  const motion = useRef({ moving, rotating, pose })
  const garment = garmentById(outfit.garmentId)
  const palette = palettes.find(p => p.id === outfit.colorId) ?? palettes[0]
  const occasion = occasions.find(o => o.id === outfit.occasionId) ?? occasions[2]
  const selectedAccessories = accessories.filter(a => outfit.accessoryIds.includes(a.id))

  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'low-power' })
    } catch {
      const errorFrame = requestAnimationFrame(() => setStatus('error'))
      return () => cancelAnimationFrame(errorFrame)
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.22
    renderer.shadowMap.enabled = !compact
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.domElement.setAttribute('aria-label', 'Kéo để xoay nhân vật 3D. Dùng nút bên dưới hoặc phím mũi tên để đổi góc nhìn.')
    renderer.domElement.setAttribute('role', 'img')
    element.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 50)
    camera.position.set(.75, 2.3, 7.6)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1.8, 0)
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = .09
    controls.minDistance = 3.3
    controls.maxDistance = 11
    controls.minPolarAngle = .72
    controls.maxPolarAngle = 1.78
    controls.autoRotateSpeed = .65
    controls.rotateSpeed = .65
    controls.saveState()
    controls.update()
    scene.add(new THREE.HemisphereLight('#ffe7ca', '#3c455d', 2.35))
    const keyLight = new THREE.DirectionalLight('#fff0db', 4.2)
    keyLight.position.set(3, 5, 4); keyLight.castShadow = !compact
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -3
    keyLight.shadow.camera.right = keyLight.shadow.camera.top = 3
    keyLight.shadow.normalBias = .03
    scene.add(keyLight)
    const fill = new THREE.DirectionalLight('#d1e0ff', 2.1); fill.position.set(-3, 2, 2); scene.add(fill)
    const rim = new THREE.DirectionalLight('#e4b760', 4); rim.position.set(-1, 4, -3); scene.add(rim)
    const podium = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.12, .09, 64), new THREE.MeshStandardMaterial({ color: '#242329', roughness: .45, metalness: .4 }))
    podium.position.y = .025; podium.receiveShadow = true; scene.add(podium)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.04, .012, 8, 64), new THREE.MeshStandardMaterial({ color: '#d1ac66', metalness: .8, roughness: .2 }))
    ring.rotation.x = Math.PI / 2; ring.position.y = .074; scene.add(ring)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.ShadowMaterial({ opacity: .32 }))
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.03; ground.receiveShadow = true; scene.add(ground)
    let character: CharacterRig = buildCharacter(selection.current)
    scene.add(character.root)
    let inView = true, lastTime = 0, elapsed = 0, lastUi = 0, lastRender = 0, disposed = false, firstFrame = true

    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (width < 1 || height < 1) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.fov = width / height < .64 ? 39 : 32
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize); observer.observe(element)
    const visibility = new IntersectionObserver(entries => { inView = entries[0].isIntersecting }, { threshold: .01 }); visibility.observe(element)
    resize()
    const onStart = () => { motion.current.rotating = false; setRotating(false) }
    controls.addEventListener('start', onStart)
    const onContextLost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); setStatus('error') }
    renderer.domElement.addEventListener('webglcontextlost', onContextLost)

    controller.current = {
      setOutfit(next) {
        scene.remove(character.root)
        character.dispose()
        character = buildCharacter(next)
        scene.add(character.root)
        renderer.render(scene, camera)
      },
      rotate(radians) {
        const offset = camera.position.clone().sub(controls.target)
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), radians)
        camera.position.copy(controls.target).add(offset)
        controls.update()
        renderer.render(scene, camera)
        setAngle(Math.round(THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())))
      },
      zoom(amount) {
        const offset = camera.position.clone().sub(controls.target)
        const distance = THREE.MathUtils.clamp(offset.length() * amount, controls.minDistance, controls.maxDistance)
        camera.position.copy(controls.target).add(offset.setLength(distance))
        controls.update(); renderer.render(scene, camera)
      },
      reset() { controls.reset(); controls.update(); setAngle(0); renderer.render(scene, camera) },
      capture() {
        renderer.render(scene, camera)
        renderer.domElement.toBlob(blob => {
          if (!blob || disposed) return
          const url = URL.createObjectURL(blob)
          const anchor = document.createElement('a'); anchor.href = url; anchor.download = `resac-${selection.current.garmentId}-3d.png`
          document.body.appendChild(anchor); anchor.click(); anchor.remove()
          setTimeout(() => URL.revokeObjectURL(url), 30000)
          setCaptureMessage('Đã tạo ảnh PNG của nhân vật hiện tại.')
        }, 'image/png')
      },
    }

    renderer.setAnimationLoop(time => {
      if (document.hidden || !inView || !activeRef.current) { lastTime = time; return }
      if (time - lastRender < 1000 / (compact ? 24 : 40)) return
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .1) : 0
      lastTime = time
      lastRender = time
      if (motion.current.moving) elapsed += delta
      if (motion.current.moving) character.animate(elapsed, motion.current.pose, true)
      controls.autoRotate = motion.current.rotating
      controls.update(delta)
      renderer.render(scene, camera)
      if (firstFrame) { firstFrame = false; setStatus('ready') }
      if (time - lastUi > 500) {
        setAngle(Math.round(THREE.MathUtils.radToDeg(controls.getAzimuthalAngle())))
        lastUi = time
      }
    })
    return () => {
      disposed = true
      controller.current = null
      renderer.setAnimationLoop(null)
      observer.disconnect(); visibility.disconnect()
      controls.removeEventListener('start', onStart); controls.dispose()
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      disposeObject(scene)
      keyLight.shadow.dispose()
      renderer.dispose(); renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [compact, attempt])

  useEffect(() => { selection.current = outfit; controller.current?.setOutfit(outfit) }, [outfit])
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => { motion.current = { moving, rotating, pose } }, [moving, rotating, pose])
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => { if (preference.matches) { setMoving(false); setRotating(false) } }
    preference.addEventListener('change', onChange)
    return () => preference.removeEventListener('change', onChange)
  }, [])

  function rotate(degrees: number) { setRotating(false); motion.current.rotating = false; controller.current?.rotate(THREE.MathUtils.degToRad(degrees)) }
  return <div className={`character-stage ${compact ? 'character-compact' : ''}`} data-testid="character-stage" data-garment={outfit.garmentId} data-color={outfit.colorId} data-accessories={outfit.accessoryIds.join(',')} data-pose={pose} data-moving={moving} data-angle={angle} data-renderer={status} data-occasion={outfit.occasionId}>
    <div className="stage-backdrop" data-occasion={outfit.occasionId} aria-hidden="true"><i /><i /><i /></div>
    <div className="stage-badge"><Move3D size={13} /><span>NHÂN VẬT 3D</span><i className={moving ? 'live' : ''} /></div>
    <div ref={host} className="character-canvas" tabIndex={0} onKeyDown={e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); rotate(e.key === 'ArrowLeft' ? -30 : 30) }
      if (e.key === '+' || e.key === '=') { e.preventDefault(); controller.current?.zoom(.85) }
      if (e.key === '-') { e.preventDefault(); controller.current?.zoom(1.18) }
      if (e.key === 'Home') { e.preventDefault(); controller.current?.reset() }
    }} aria-label={`Xem 3D ${garment.name}, màu ${palette.name}. ${selectedAccessories.length ? 'Đang đeo ' + selectedAccessories.map(a => a.name).join(', ') : 'Không có phụ kiện'}.`} />
    {status === 'loading' && <div className="stage-loading" role="status"><Move3D size={30} />Đang dựng nhân vật…</div>}
    {status === 'error' && <div className="stage-error" role="alert"><Move3D size={26} /><strong>Chưa mở được khung 3D</strong><p>Trình duyệt cần bật tăng tốc đồ họa WebGL để xem nhân vật.</p><button className="button button-gold" onClick={() => { setStatus('loading'); setAttempt(a => a + 1) }}>Thử lại</button></div>}
    {!compact && <div className="stage-outfit-info"><strong>{outfitName(outfit)}</strong><span><i style={{ background: palette.colors[0] }} /><i style={{ background: palette.colors[1] }} />{palette.name} · {occasion.shortName} · {outfit.style}</span><small>{selectedAccessories.map(a => a.name).join(' · ') || 'Chưa đeo phụ kiện'}</small></div>}
    <div className="stage-controls" aria-label="Điều khiển nhân vật 3D">
      <div className="stage-view-controls">
        <button aria-label="Xoay trái 30 độ" title="Xoay trái" onClick={() => rotate(-30)} disabled={status !== 'ready'}><ChevronLeft size={17} /></button>
        <button aria-label="Tự xoay nhân vật" title="Tự xoay 360°" aria-pressed={rotating} onClick={() => setRotating(!rotating)} disabled={status !== 'ready'}><RotateCw size={16} /></button>
        <button aria-label="Xoay phải 30 độ" title="Xoay phải" onClick={() => rotate(30)} disabled={status !== 'ready'}><ChevronRight size={17} /></button>
        {!compact && <><span className="stage-control-divider" /><button aria-label="Phóng to nhân vật" title="Phóng to" onClick={() => controller.current?.zoom(.85)} disabled={status !== 'ready'}><ZoomIn size={16} /></button><button aria-label="Thu nhỏ nhân vật" title="Thu nhỏ" onClick={() => controller.current?.zoom(1.18)} disabled={status !== 'ready'}><ZoomOut size={16} /></button><button aria-label="Đặt lại góc nhìn" title="Đặt lại góc nhìn" onClick={() => { setRotating(false); controller.current?.reset() }} disabled={status !== 'ready'}><RotateCcw size={15} /></button></>}
        <button aria-label={moving ? 'Tạm dừng chuyển động' : 'Bật chuyển động'} title={moving ? 'Tạm dừng' : 'Bật chuyển động'} aria-pressed={moving} onClick={() => { setMoving(!moving); if (moving) setRotating(false) }} disabled={status !== 'ready'}>{moving ? <Pause size={15} /> : <Play size={15} />}</button>
      </div>
      {!compact && <div className="stage-pose-controls"><span>Kéo để xoay · {angle}°</span><button aria-pressed={pose === 'idle'} onClick={() => { setPose('idle'); setMoving(true) }}><PersonStanding size={14} />Đứng</button><button aria-pressed={pose === 'wave'} onClick={() => { setPose('wave'); setMoving(true) }}><Hand size={14} />Chào</button><button aria-pressed={pose === 'walk'} onClick={() => { setPose('walk'); setMoving(true) }}><PersonStanding size={14} />Bước</button></div>}
    </div>
    {!compact && <button className="stage-capture" onClick={() => controller.current?.capture()} disabled={status !== 'ready'}>Chụp ảnh</button>}
    <span className="sr-only" role="status">{captureMessage}</span>
  </div>
}
