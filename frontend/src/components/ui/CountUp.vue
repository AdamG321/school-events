<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  to: number
  duration?: number
  prefix?: string
  suffix?: string
}>(), { duration: 1500, prefix: '', suffix: '' })

const display = ref(0)

function animate() {
  const start = performance.now()
  const from = 0
  const to = props.to
  function step(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / props.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(from + (to - from) * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(animate)
watch(() => props.to, animate)
</script>

<template>
  <span>{{ prefix }}{{ display }}{{ suffix }}</span>
</template>
