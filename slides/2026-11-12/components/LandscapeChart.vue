<script setup lang="ts">
import { computed } from 'vue'
import layout from '../data/landscape.json'

// Agent computer landscape: X = monthly cost of one 2C4G computer (log), Y = 电脑完整度.
// step 0: classics only (E2B + VPS camp), on-demand pricing
// step 1: every vendor, on-demand pricing
// step 2: every vendor, 24 h always-on pricing (points slide right)
const props = withDefaults(defineProps<{ step?: number }>(), { step: 2 })

type P = (typeof layout.modes.ondemand)[number]
const M = { l: 60, r: 24, t: 26, b: 46 }
const VW = layout.W + M.l + M.r
const VH = layout.H + M.t + M.b
const R = 13

const mode = computed(() => (props.step >= 2 ? 'always' : 'ondemand'))
const ids = [...new Set([...layout.modes.ondemand, ...layout.modes.always].map((p) => p.id))]
const byMode = (m: 'ondemand' | 'always') => new Map((layout.modes[m] as P[]).map((p) => [p.id, p]))
const maps = { ondemand: byMode('ondemand'), always: byMode('always') }

const points = computed(() =>
  ids.map((id) => {
    const cur = maps[mode.value].get(id)
    const any = (cur ?? maps.ondemand.get(id) ?? maps.always.get(id)) as P
    const visible = !!cur && (props.step >= 1 || any.stage === 0)
    return { ...any, ...(cur ?? {}), visible }
  }),
)

const COLOR: Record<string, string> = { Sandbox: '#809aef', VPS: '#f6efe5', Hybrid: '#bbcdf1' }
</script>

<template>
  <svg :viewBox="`0 0 ${VW} ${VH}`" class="landscape block w-full" role="img" aria-label="Agent 云电脑：成本与完整度">
    <g :transform="`translate(${M.l} ${M.t})`">
      <g v-for="t in layout.xticks" :key="`x${t.v}`">
        <line :x1="t.x" :x2="t.x" y1="0" :y2="layout.H" class="grid" />
        <text :x="t.x" :y="layout.H + 20" text-anchor="middle" class="tick">${{ t.v }}</text>
      </g>
      <g v-for="t in layout.yticks" :key="`y${t.v}`">
        <line x1="0" :x2="layout.W" :y1="t.y" :y2="t.y" class="grid" />
        <text x="-12" :y="t.y + 4" text-anchor="end" class="tick">{{ t.v }}</text>
      </g>
      <text :x="layout.W / 2" :y="layout.H + 40" text-anchor="middle" class="axis">
        每台 2C4G 云电脑的月成本（美元，对数刻度）· {{ mode === 'always' ? '24 小时常驻' : '每天用 2 小时，能暂停就暂停' }}
      </text>
      <text :transform="`translate(-44 ${layout.H / 2}) rotate(-90)`" text-anchor="middle" class="axis">电脑完整度</text>

      <g
        v-for="p in points"
        :key="p.id"
        class="pt"
        :style="{ opacity: p.visible ? 1 : 0 }"
      >
        <line
          :x1="p.x" :y1="p.y0" :x2="p.x" :y2="p.y"
          class="leader" :style="{ opacity: Math.abs(p.y - p.y0) > 1 ? 1 : 0 }"
        />
        <g class="mark" :style="{ transform: `translate(${p.x}px, ${p.y}px)` }">
          <rect
            v-if="p.camp === 'VPS'"
            :x="-R + 1" :y="-R + 1" :width="2 * R - 2" :height="2 * R - 2" rx="5"
            :stroke="COLOR.VPS" :stroke-dasharray="p.dashed ? '3 3' : undefined" class="ring"
          />
          <path
            v-else-if="p.camp === 'Hybrid'"
            :d="`M0 ${-R - 3} L${R + 3} 0 L0 ${R + 3} L${-R - 3} 0Z`"
            :stroke="COLOR.Hybrid" class="ring" stroke-linejoin="round"
          />
          <circle v-else r="12" :stroke="COLOR.Sandbox" class="ring" />
          <image :href="p.logo" x="-9" y="-9" width="18" height="18" style="clip-path: inset(0 round 4px)" />
        </g>
        <text
          class="lbl"
          :text-anchor="p.anchor"
          :style="{ transform: `translate(${p.lx}px, ${p.ly}px)` }"
        >{{ p.label }}</text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.landscape .grid {
  stroke: rgb(255 255 255 / 0.06);
  stroke-width: 1;
}
.landscape .tick {
  font-family: "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  fill: #82807d;
}
.landscape .axis {
  font-size: 12px;
  fill: #abaaa8;
}
.landscape .ring {
  fill: #ffffff;
  stroke-width: 2.5;
}
.landscape .lbl {
  font-size: 11.5px;
  fill: #e6e6e5;
  paint-order: stroke;
  stroke: #36332d;
  stroke-width: 4px;
  stroke-linejoin: round;
}
.landscape .leader {
  stroke: #59554d;
  stroke-dasharray: 2 3;
}
.landscape .pt,
.landscape .mark,
.landscape .lbl,
.landscape .leader {
  transition:
    transform 1.1s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.6s ease;
}
</style>
