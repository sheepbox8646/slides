<script setup lang="ts">
import { computed } from 'vue'
import { pt, type V3 } from '../../lib/iso'

// A flat, screen-aligned callout joined to a world point by a dashed leader.
const props = withDefaults(
  defineProps<{
    at: V3
    dx: number
    dy: number
    text: string
    sub?: string
    tone?: 'muted' | 'accent' | 'danger'
    dot?: boolean
  }>(),
  { tone: 'muted', dot: true },
)

const geo = computed(() => {
  const [ax, ay] = pt(...props.at)
  const bx = ax + props.dx
  const by = ay + props.dy
  const dir = props.dx < 0 ? -1 : 1
  const cx = bx + dir * 8
  return {
    ax,
    ay,
    leader: `M${ax} ${ay} L${bx} ${by} L${cx} ${by}`,
    tx: cx + dir * 4,
    ty: by + 3.5,
    anchor: dir < 0 ? 'end' : 'start',
  }
})
</script>

<template>
  <g class="iso-label" :class="`label-${tone}`">
    <circle v-if="dot" :cx="geo.ax" :cy="geo.ay" r="1.8" class="label-dot" />
    <path :d="geo.leader" class="label-leader" />
    <text :x="geo.tx" :y="geo.ty" :text-anchor="geo.anchor" class="label-text">{{ text }}</text>
    <text v-if="sub" :x="geo.tx" :y="geo.ty + 12" :text-anchor="geo.anchor" class="label-sub">{{ sub }}</text>
  </g>
</template>
