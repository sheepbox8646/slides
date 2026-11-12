<script setup lang="ts">
// Chapter divider in the brand manual's style: a number top-left, a two-line headline
// with the first line in Stone and the second in white, ending with a full stop.
defineProps<{ no: string; top: string; bottom: string; note?: string }>()
</script>

<template>
  <div class="relative h-full">
    <div class="absolute left-0 top-0 text-xl font-bold">{{ no }}</div>
    <div class="absolute left-0 bottom-14">
      <div class="reveal text-[64px] leading-[1.05] font-bold tracking-[-0.02em] text-muted">{{ top }}</div>
      <div class="reveal text-[64px] leading-[1.15] font-bold tracking-[-0.02em] text-white" style="animation-delay: 100ms">{{ bottom }}</div>
      <div v-if="note" class="reveal mt-5 text-base text-muted" style="animation-delay: 200ms">{{ note }}</div>
    </div>
  </div>
</template>
