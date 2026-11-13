<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

// Page background for every slide.
// Background: Base Black with the landing's bottom fade, the dot field, and one slow Collab Blue glow
// whose position follows the slide (frontmatter `glow: tl | tr | bl | br | c | none`).
// The footer lives in slide-bottom.vue so each slide (and each exported PDF page) gets its own number.
// isPrintMode is true while `slidev export` renders the PDF (it prints with screen media, so @media print never applies).
const { currentSlideRoute, isPrintMode } = useNav()
const fm = computed(() => (currentSlideRoute.value?.meta?.slide?.frontmatter ?? {}) as Record<string, any>)

const GLOW: Record<string, [number, number]> = {
  tl: [12, 10],
  tr: [88, 8],
  bl: [10, 92],
  br: [90, 92],
  c: [50, 45],
  r: [92, 50],
  l: [8, 50],
}
const glowPos = computed(() => GLOW[fm.value.glow ?? 'tr'] ?? GLOW.tr)
const glowOn = computed(() => fm.value.glow !== 'none')
</script>

<template>
  <div class="k-bg" :class="{ 'k-print': isPrintMode }" aria-hidden="true">
    <div
      class="k-glow"
      :style="{ left: `${glowPos[0]}%`, top: `${glowPos[1]}%`, opacity: glowOn ? 1 : 0 }"
    />
    <div class="k-dots" />
  </div>
</template>

<style scoped>
.k-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: linear-gradient(to bottom, #2e2b26 0%, #2e2b26 55%, #2a2722 100%);
}
.k-glow {
  position: absolute;
  width: 760px;
  height: 760px;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgb(128 154 239 / 0.16), rgb(187 205 241 / 0.05) 55%, transparent 100%);
  transition:
    left 2.4s cubic-bezier(0.65, 0, 0.35, 1),
    top 2.4s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 1.2s ease;
  animation: k-breathe 9s ease-in-out infinite;
}
.k-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgb(255 255 255 / 0.05) 1px, transparent 1.3px);
  background-size: 14px 14px;
  background-position: 7px 7px;
  mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 0%, transparent 100%);
}
@keyframes k-breathe {
  0%, 100% { scale: 1; }
  50% { scale: 1.12; }
}

/* Exported PDF: PDF viewers turn the blurred glow, the dot mask and the bottom fade into hard-edged bands. */
.k-print {
  background: #2e2b26;
}
.k-print .k-glow,
.k-print .k-dots {
  display: none;
}
</style>
