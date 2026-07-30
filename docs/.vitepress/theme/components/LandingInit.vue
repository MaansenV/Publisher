<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { initLanding } from '../landing'

// Renderless: only boots/tears down the landing engine. Rendered inside
// <ClientOnly> on the landing page so init runs after the landing DOM is
// mounted and destroy runs on SPA navigation away (no orphaned RAFs/listeners).
let destroy: (() => void) | null = null

onMounted(() => {
  try {
    destroy = initLanding()
  } catch (e) {
    console.error('[landing] initLanding threw', e)
  }
})

onUnmounted(() => {
  try {
    destroy?.()
  } catch (e) {
    console.error('[landing] destroyLanding threw', e)
  }
  destroy = null
})
</script>

<template></template>
