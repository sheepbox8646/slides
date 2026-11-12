<script setup lang="ts">
// On narrow screens the drawing is limited by width, so the floor height shrinks with the viewport.
withDefaults(
  defineProps<{ viewBox: string; label: string; minHeight?: number; shrinkVw?: number; bare?: boolean }>(),
  { minHeight: 230, shrinkVw: 62, bare: false },
)
</script>

<template>
  <div class="relative flex-1 overflow-hidden" :class="bare ? '' : 'iso-stage rounded-[14px]'" :style="{ minHeight: `min(${minHeight}px, ${shrinkVw}vw)` }">
    <div v-if="bare" class="iso-stage-bare absolute inset-0" aria-hidden="true" />
    <svg
      class="absolute inset-0 h-full w-full"
      :viewBox="viewBox"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="label"
    >
      <slot />
    </svg>
  </div>
</template>
