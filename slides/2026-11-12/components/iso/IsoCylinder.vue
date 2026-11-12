<script setup lang="ts">
import { computed } from 'vue'
import { isoEllipse, pt, type IsoTone } from '../../lib/iso'

// (x, y, z) is the centre of the base disc.
const props = withDefaults(
  defineProps<{ x: number; y: number; z?: number; r: number; h: number; tone?: IsoTone; rings?: number }>(),
  { z: 0, tone: 'base', rings: 0 },
)

const shape = computed(() => {
  const { rx, ry } = isoEllipse(props.r)
  const [bx, by] = pt(props.x, props.y, props.z)
  const [tx, ty] = pt(props.x, props.y, props.z + props.h)
  const side = `M${tx - rx} ${ty} L${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} L${tx + rx} ${ty} Z`
  // Optional platter lines on the side, for disks.
  const rings = Array.from({ length: props.rings }, (_, i) => {
    const [, ry2] = pt(props.x, props.y, props.z + (props.h * (i + 1)) / (props.rings + 1))
    return `M${bx - rx} ${ry2} A${rx} ${ry} 0 0 0 ${bx + rx} ${ry2}`
  })
  return { rx, ry, tx, ty, side, rings }
})
</script>

<template>
  <g class="iso-solid" :class="`tone-${tone}`">
    <path :d="shape.side" class="face-left" />
    <path v-for="(d, i) in shape.rings" :key="i" :d="d" class="ring" />
    <ellipse :cx="shape.tx" :cy="shape.ty" :rx="shape.rx" :ry="shape.ry" class="face-top" />
  </g>
</template>
