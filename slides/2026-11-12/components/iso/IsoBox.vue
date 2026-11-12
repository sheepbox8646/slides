<script setup lang="ts">
import { computed } from 'vue'
import { boxFaces, type IsoTone } from '../../lib/iso'

const props = withDefaults(
  defineProps<{ x: number; y: number; z?: number; w: number; d: number; h: number; tone?: IsoTone }>(),
  { z: 0, tone: 'base' },
)
const faces = computed(() => boxFaces({ x: props.x, y: props.y, z: props.z, w: props.w, d: props.d, h: props.h }))
</script>

<template>
  <g class="iso-solid" :class="`tone-${tone}`">
    <path :d="faces.left" class="face-left" />
    <path :d="faces.right" class="face-right" />
    <path :d="faces.top" class="face-top" />
  </g>
</template>
