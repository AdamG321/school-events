<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animId: number
let mouse = { x: 0, y: 0 }

const objects: THREE.Mesh[] = []

function init() {
  if (!canvasRef.value) return

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, 8)

  // Ambient + directional light
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const dirLight = new THREE.DirectionalLight(0x6366f1, 1.2)
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)
  const accentLight = new THREE.PointLight(0xf59e0b, 1.5, 20)
  accentLight.position.set(-4, 2, 3)
  scene.add(accentLight)

  // Floating school-themed shapes
  const geometries = [
    new THREE.IcosahedronGeometry(0.5, 0),      // gem/star
    new THREE.OctahedronGeometry(0.45, 0),       // diamond
    new THREE.TetrahedronGeometry(0.5, 0),       // pyramid
    new THREE.BoxGeometry(0.7, 0.7, 0.7),        // cube/book
    new THREE.TorusGeometry(0.35, 0.12, 8, 20),  // ring
  ]

  const colors = [0x6366f1, 0xf59e0b, 0x10b981, 0x8b5cf6, 0xec4899]

  for (let i = 0; i < 18; i++) {
    const geo = geometries[i % geometries.length]
    const mat = new THREE.MeshPhongMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.75,
      shininess: 80,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6 - 2
    )
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    ;(mesh as any)._speed = {
      rot: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
    }
    scene.add(mesh)
    objects.push(mesh)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
  animate()
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  objects.forEach((obj) => {
    const s = (obj as any)._speed
    obj.rotation.x += s.rot
    obj.rotation.y += s.rot * 1.3
    obj.position.y += Math.sin(t + s.phase) * 0.0015
  })

  // Subtle camera parallax on mouse
  camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
  camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
}

function onMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
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
