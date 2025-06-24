<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import BackToTops from './BackToTop.vue';

import { useData } from 'vitepress'
import { nextTick, provide } from 'vue'

const { isDark } = useData()

const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
      }
  )
})
</script>

<template>
  <DefaultTheme.Layout>

    <!-- doc-footer-before插槽 -->
    <template #doc-footer-before>
      <BackToTops />
    </template>

  </DefaultTheme.Layout>
</template>

<style scoped>

</style>