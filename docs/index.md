---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "UTest"
  text: "Ai Test platform"
  tagline: 一款致力于打造多功能测试平台项目。
  image:
    src: /logo-uwu.png
    alt: VitePress
  actions:
    - theme: brand
      text: 开始
      link: /markdown-examples
    - theme: alt
      text: GitHub
      link: /api-examples

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { version } from '.vitepress/theme/untils/version'
 
  onMounted(() => {
    version()
  })
</script>

<confetti />


