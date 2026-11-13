<script setup lang="ts">
import { computed } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

// Footer for each slide: reverse mark on the left, page number on the right.
// Rendered per slide (not globally) so every exported PDF page carries its own number.
// Hide it on a slide with frontmatter `footer: false`.
const { total } = useNav()
const { $page, $frontmatter } = useSlideContext()
const show = computed(() => $frontmatter?.footer !== false)
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <footer v-if="show" class="k-footer">
    <img src="/brand/kibotos-mark-white.svg" alt="" class="k-footer-mark" />
    <span class="k-footer-page">{{ pad($page) }} / {{ pad(total) }}</span>
  </footer>
</template>

<style scoped>
.k-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 44px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0 34px;
  font-size: 9px;
  color: #82807d;
  pointer-events: none;
}
.k-footer-mark {
  width: 18px;
  height: 18px;
}
.k-footer-page {
  font-family: "Fira Code", ui-monospace, monospace;
}
</style>
