<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  spotlightColor?: string
  class?: string
}>(), {
  spotlightColor: 'rgba(99, 102, 241, 0.12)',
})

const cardRef = ref<HTMLDivElement | null>(null)
const pos = ref({ x: 0, y: 0, opacity: 0 })

function onMove(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  pos.value = { x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 }
}
function onLeave() { pos.value.opacity = 0 }
</script>

<template>
  <div ref="cardRef" class="relative overflow-hidden" @mousemove="onMove" @mouseleave="onLeave">
    <div
      class="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
      :style="{
        background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        opacity: pos.opacity,
      }"
    />
    <slot />
  </div>
</template>
