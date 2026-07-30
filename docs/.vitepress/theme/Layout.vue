<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Landing page is a full-bleed custom page — no VitePress nav/sidebar.
// Every other route uses the default (cyberpunk-themed) docs layout.
const isLanding = computed(() => frontmatter.value.layout === 'landing')
</script>

<template>
  <div v-if="isLanding" class="landing-root">
    <Content />
  </div>
  <Layout v-else />
</template>
