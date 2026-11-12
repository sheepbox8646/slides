<script setup lang="ts">
import { computed } from 'vue'
import { boxCorners, fit, labelExtent, pt, type Box, type V3 } from '../lib/iso'
import IsoStage from './iso/IsoStage.vue'
import IsoBox from './iso/IsoBox.vue'
import IsoCylinder from './iso/IsoCylinder.vue'
import IsoLabel from './iso/IsoLabel.vue'

// The cluster in the landing's isometric style:
// a rack of compute machines (VMs only, no user data) wired to a separate storage pool.
const props = withDefaults(defineProps<{ compute?: number; highlight?: number }>(), { compute: 6, highlight: -1 })

const floor: Box = { x: 0, y: 0, z: 0, w: 15.4, d: 5.4, h: 0.25 }
const U = { w: 1.6, d: 1.0, h: 0.38 }
const computeBoxes = computed<Box[]>(() =>
  Array.from({ length: props.compute }, (_, i) => {
    const col = i % 8
    const row = Math.floor(i / 8)
    return { x: 0.4 + col * 1.85, y: 0.4 + row * 1.3, z: 0.25, ...U }
  }),
)
const disks = [
  { x: 3.5, y: 4.4 },
  { x: 7.7, y: 4.4 },
  { x: 11.9, y: 4.4 },
]
const diskTop = (d: { x: number; y: number }): V3 => [d.x, d.y, 1.55]

const wires = computed(() =>
  computeBoxes.value.map((b, i) => {
    const d = disks[i % disks.length]
    const [ax, ay] = pt(b.x + b.w / 2, b.y + b.d, b.z + b.h / 2)
    const [bx, by] = pt(...diskTop(d))
    return `M${ax.toFixed(1)} ${ay.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`
  }),
)

const labels = computed(() => [
  { at: [computeBoxes.value[0].x, computeBoxes.value[0].y + U.d, 0.45] as V3, dx: -26, dy: -18, text: '计算机器', sub: '64 线程 · 512 GB · 只跑 VM' },
  { at: [disks[0].x - 0.45, disks[0].y, 0.8] as V3, dx: -28, dy: 22, text: '存储池', sub: '可写层与 /data 卷', tone: 'accent' as const },
])

const viewBox = computed(() =>
  fit(
    [floor, ...computeBoxes.value].flatMap(boxCorners),
    labels.value.flatMap((l) => labelExtent(l.at, l.dx, l.dy, l.text, l.sub)),
    14,
  ),
)
</script>

<template>
  <IsoStage :view-box="viewBox" :min-height="300" :shrink-vw="100" label="计算机器与存储池分离">
    <IsoBox v-bind="floor" />
    <path v-for="(d, i) in wires" :key="`w-${i}`" :d="d" class="iso-wire is-accent is-flowing" />
    <IsoBox
      v-for="(b, i) in computeBoxes"
      :key="`c-${i}`"
      v-bind="b"
      :tone="i === highlight ? 'accent' : i >= 6 ? 'ghost' : 'base'"
    />
    <IsoCylinder v-for="(d, i) in disks" :key="`d-${i}`" :x="d.x" :y="d.y" :z="0.25" :r="0.55" :h="1.3" :rings="3" tone="accent" />
    <IsoLabel v-for="l in labels" :key="l.text" v-bind="l" />
  </IsoStage>
</template>
