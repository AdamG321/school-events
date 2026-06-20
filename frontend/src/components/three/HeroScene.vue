<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animId: number
let mouse = { x: 0, y: 0 }
const mouseNDC = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
const cursorWorldPos = new THREE.Vector3()
let hoveredObj: THREE.Mesh | null = null

const objects: THREE.Mesh[] = []
const originPositions: THREE.Vector3[] = []

function init() {
  if (!canvasRef.value) return

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 8)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const dirLight = new THREE.DirectionalLight(0x6366f1, 1.2)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)
  const accentLight = new THREE.PointLight(0xf59e0b, 1.5, 20)
  accentLight.position.set(-4, 2, 3)
  scene.add(accentLight)

  const geometries = [
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.45, 0),
    new THREE.TetrahedronGeometry(0.5, 0),
    new THREE.BoxGeometry(0.7, 0.7, 0.7),
    new THREE.TorusGeometry(0.35, 0.12, 8, 20),
  ]
  const colors = [0x6366f1, 0xf59e0b, 0x10b981, 0x8b5cf6, 0xec4899]

  for (let i = 0; i < 18; i++) {
    const geo = geometries[i % geometries.length]
    const mat = new THREE.MeshPhongMaterial({
      color: colors[i % colors.length],
      emissive: new THREE.Color(0x000000),
      transparent: true,
      opacity: 0.75,
      shininess: 80,
    })
    const mesh = new THREE.Mesh(geo, mat)
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6 - 2
    )
    mesh.position.copy(pos)
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    ;(mesh as any)._speed = {
      rot: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
    }
    scene.add(mesh)
    objects.push(mesh)
    originPositions.push(pos.clone())
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
  animate()
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  // Raycast for hover
  raycaster.setFromCamera(mouseNDC, camera)
  raycaster.ray.at(6, cursorWorldPos)
  const intersects = raycaster.intersectObjects(objects)
  const newHovered = intersects.length > 0 ? intersects[0].object as THREE.Mesh : null

  // Reset previous hover
  if (hoveredObj && hoveredObj !== newHovered) {
    ;(hoveredObj.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000)
  }
  // Apply new hover glow
  if (newHovered) {
    const mat = newHovered.material as THREE.MeshPhongMaterial
    mat.emissive.setHex((mat as any).color.getHex())
    mat.emissiveIntensity = 0.35
  }
  hoveredObj = newHovered

  objects.forEach((obj, i) => {
    const s = (obj as any)._speed
    const origin = originPositions[i]

    // Rotate
    obj.rotation.x += s.rot
    obj.rotation.y += s.rot * 1.3

    // Float
    obj.position.y += Math.sin(t + s.phase) * 0.0015

    // Cursor repulsion
    const dist = obj.position.distanceTo(cursorWorldPos)
    const repulseRadius = 2.2
    if (dist < repulseRadius && dist > 0.01) {
      const force = ((repulseRadius - dist) / repulseRadius) * 0.06
      const dir = obj.position.clone().sub(cursorWorldPos).normalize()
      obj.position.addScaledVector(dir, force)
    }

    // Drift back to origin (XZ only, Y handled by float)
    obj.position.x += (origin.x - obj.position.x) * 0.012
    obj.position.z += (origin.z - obj.position.z) * 0.012

    // Hover: scale up
    const targetScale = obj === newHovered ? 1.35 : 1.0
    obj.scale.x += (targetScale - obj.scale.x) * 0.12
    obj.scale.y += (targetScale - obj.scale.y) * 0.12
    obj.scale.z += (targetScale - obj.scale.z) * 0.12
  })

  // Camera parallax
  camera.position.x += (mouse.x * 1.0 - camera.position.x) * 0.05
  camera.position.y += (-mouse.y * 0.6 - camera.position.y) * 0.05
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

function onMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
  mouseNDC.x = mouse.x
  mouseNDC.y = -mouse.y
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(init)
onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />
</template>
