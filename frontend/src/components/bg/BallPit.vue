<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId: number
let ctx: CanvasRenderingContext2D
let W = 0
let H = 0
const mouse = { x: -9999, y: -9999 }

interface Ball {
  x: number; y: number
  vx: number; vy: number
  r: number
  color: string
  glowColor: string
}

const PALETTE = [
  { fill: 'rgba(99,102,241,0.85)',  glow: '#6366f1' },
  { fill: 'rgba(139,92,246,0.85)', glow: '#8b5cf6' },
  { fill: 'rgba(6,182,212,0.75)',  glow: '#06b6d4' },
  { fill: 'rgba(236,72,153,0.7)',  glow: '#ec4899' },
  { fill: 'rgba(245,158,11,0.7)',  glow: '#f59e0b' },
]

const GRAVITY   = 0.25
const FRICTION  = 0.995
const BOUNCE    = 0.72
const COUNT     = 28
const MOUSE_R   = 120
const MOUSE_F   = 6

let balls: Ball[] = []

function makeBalls() {
  balls = Array.from({ length: COUNT }, () => {
    const p = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    const r = 18 + Math.random() * 28
    return {
      x: r + Math.random() * (W - 2 * r),
      y: -r - Math.random() * H * 0.5,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2,
      r,
      color: p.fill,
      glowColor: p.glow,
    }
  })
}

function resize() {
  if (!canvasRef.value) return
  W = canvasRef.value.offsetWidth
  H = canvasRef.value.offsetHeight
  canvasRef.value.width  = W * devicePixelRatio
  canvasRef.value.height = H * devicePixelRatio
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
}

function drawBall(b: Ball) {
  // Glow
  ctx.save()
  ctx.shadowColor = b.glowColor
  ctx.shadowBlur  = 20
  ctx.beginPath()
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
  ctx.fillStyle = b.color
  ctx.fill()
  ctx.restore()

  // Specular highlight
  const grad = ctx.createRadialGradient(
    b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.05,
    b.x, b.y, b.r
  )
  grad.addColorStop(0, 'rgba(255,255,255,0.28)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.05)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
}

function step() {
  ctx.clearRect(0, 0, W, H)

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i]

    // Physics
    b.vy += GRAVITY
    b.vx *= FRICTION
    b.vy *= FRICTION
    b.x += b.vx
    b.y += b.vy

    // Mouse repulsion
    const dx = b.x - mouse.x
    const dy = b.y - mouse.y
    const d  = Math.hypot(dx, dy)
    if (d < MOUSE_R && d > 0.1) {
      const force = (MOUSE_R - d) / MOUSE_R * MOUSE_F
      b.vx += (dx / d) * force
      b.vy += (dy / d) * force
    }

    // Wall collisions
    if (b.x - b.r < 0)  { b.x = b.r;      b.vx =  Math.abs(b.vx) * BOUNCE }
    if (b.x + b.r > W)  { b.x = W - b.r;  b.vx = -Math.abs(b.vx) * BOUNCE }
    if (b.y - b.r < 0)  { b.y = b.r;      b.vy =  Math.abs(b.vy) * BOUNCE }
    if (b.y + b.r > H)  { b.y = H - b.r;  b.vy = -Math.abs(b.vy) * BOUNCE }

    // Ball–ball collisions
    for (let j = i + 1; j < balls.length; j++) {
      const o  = balls[j]
      const ex = o.x - b.x
      const ey = o.y - b.y
      const ed = Math.hypot(ex, ey)
      const md = b.r + o.r
      if (ed < md && ed > 0.01) {
        const nx = ex / ed
        const ny = ey / ed
        const ov = (md - ed) * 0.5
        b.x -= nx * ov;  b.y -= ny * ov
        o.x += nx * ov;  o.y += ny * ov
        const dot = (b.vx - o.vx) * nx + (b.vy - o.vy) * ny
        if (dot > 0) {
          b.vx -= dot * nx * BOUNCE
          b.vy -= dot * ny * BOUNCE
          o.vx += dot * nx * BOUNCE
          o.vy += dot * ny * BOUNCE
        }
      }
    }

    drawBall(b)
  }

  animId = requestAnimationFrame(step)
}

function onMouseMove(e: MouseEvent) {
  const rect = canvasRef.value!.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}
function onMouseLeave() { mouse.x = -9999; mouse.y = -9999 }

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')!
  resize()
  makeBalls()
  window.addEventListener('resize', () => { resize() })
  canvasRef.value.addEventListener('mousemove', onMouseMove)
  canvasRef.value.addEventListener('mouseleave', onMouseLeave)
  step()
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" style="cursor:none;" />
</template>
