<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { select } from 'd3-selection'
import 'd3-transition'
import { easeCubicOut } from 'd3-ease'
import {
  siAlpinelinux,
  siArchlinux,
  siDebian,
  siFedora,
  siNixos,
  siOpensuse,
  siRockylinux,
  siUbuntu,
} from 'simple-icons'
import { boxCorners, fit, labelExtent, pt, topPlane, type Box, type V3 } from '../lib/iso'
import { usePrefersReducedMotion, useSeenOnce, useStepLoop } from '../composables/motion'
import IsoStage from './iso/IsoStage.vue'
import IsoBox from './iso/IsoBox.vue'
import IsoLabel from './iso/IsoLabel.vue'

const L: Record<string, string> = {
  'hero.dataCenters': '数据中心',
  'hero.aroundTheWorld': '遍布全球',
  'hero.x86': 'x86服务器',
  'hero.environments': '运行环境',
  'hero.linuxDistros': '任意Linux发行版',
  'hero.figure': 'Kibotos的分层结构',
}
const t = (k: string) => L[k] ?? k

/*
 * Kibotos from the ground up, as an exploded isometric stack:
 *   layer 1  data centers, drawn as abstract site pins (no map, no city names)
 *   layer 2  nodes: x86 servers running KVM
 *   layer 3  Linux environments on those nodes, by distribution
 * A request pulse loops through one path at a time: site -> node -> environment.
 */

const Z_NODES = 3.6
const Z_ENVS = 7.0
// The stack is drawn larger than the callouts, which stay at their pixel size.
const K = 1.4
const k3 = (p: V3): V3 => [p[0] * K, p[1] * K, p[2] * K]

const floor: Box = { x: 0, y: 0, z: 0, w: 6.6, d: 4.6, h: 0.3 }

// Rack servers: three in the back row, two in the front row, offset like a staggered rack layout.
const X86 = { w: 1.7, d: 1.1, h: 0.42 }
const nodes: { box: Box }[] = [
  { box: { x: 0.35, y: 0.45, z: Z_NODES, ...X86 } },
  { box: { x: 2.45, y: 0.45, z: Z_NODES, ...X86 } },
  { box: { x: 4.55, y: 0.45, z: Z_NODES, ...X86 } },
  { box: { x: 1.3, y: 2.7, z: Z_NODES, ...X86 } },
  { box: { x: 3.4, y: 2.7, z: Z_NODES, ...X86 } },
]
const centre = (b: Box): [number, number] => [b.x + b.w / 2, b.y + b.d / 2]

// One site under every node, plus a few more spread across the floor.
const pins: [number, number][] = [
  ...nodes.map((n) => centre(n.box)),
  [5.8, 3.1],
  [0.6, 4.0],
  [2.6, 4.1],
  [5.3, 4.1],
]

const C = 0.68
const chip = (x: number, y: number): Box => ({ x, y, z: Z_ENVS, w: C, d: C, h: 0.18 })
type Env = { name: string; icon: { path: string }; node: number; box: Box }
// Two distributions per server, placed like the back row: 0.12 and 0.9 in from the node's left edge.
const envs: Env[] = [
  { name: 'ubuntu', icon: siUbuntu, node: 0, box: chip(0.47, 0.65) },
  { name: 'debian', icon: siDebian, node: 0, box: chip(1.25, 0.65) },
  { name: 'alpine', icon: siAlpinelinux, node: 1, box: chip(2.57, 0.65) },
  { name: 'fedora', icon: siFedora, node: 1, box: chip(3.35, 0.65) },
  { name: 'archlinux', icon: siArchlinux, node: 2, box: chip(4.67, 0.65) },
  { name: 'rockylinux', icon: siRockylinux, node: 2, box: chip(5.45, 0.65) },
  { name: 'nixos', icon: siNixos, node: 3, box: chip(1.42, 2.9) },
  { name: 'opensuse', icon: siOpensuse, node: 3, box: chip(2.2, 2.9) },
  { name: 'ubuntu-2', icon: siUbuntu, node: 4, box: chip(3.52, 2.9) },
  { name: 'debian-2', icon: siDebian, node: 4, box: chip(4.3, 2.9) },
]
const LOGO = 0.44

// The pulse visits environments in this order, hopping between servers.
const tour = [0, 4, 6, 3, 8, 5, 1, 2, 7, 9]

const labels: { at: V3; dx: number; dy: number; text: string; sub?: string }[] = [
  { at: k3([0, floor.d, floor.h / 2]), dx: -24, dy: 24, text: t('hero.dataCenters'), sub: t('hero.aroundTheWorld') },
  { at: k3([0.35, 1.55, Z_NODES + 0.21]), dx: -40, dy: -14, text: t('hero.x86') },
  { at: k3([1.42, 3.58, Z_ENVS + 0.09]), dx: -52, dy: 10, text: t('hero.environments'), sub: t('hero.linuxDistros') },
]

const viewBox = computed(() =>
  fit(
    [floor, ...nodes.map((n) => n.box), ...envs.map((e) => e.box)].flatMap(boxCorners).map(k3),
    labels.flatMap((l) => labelExtent(l.at, l.dx, l.dy, l.text, l.sub)),
    10,
  ),
)

const nodeOrder = nodes.map((n, i) => ({ n, i })).sort((a, b) => a.n.box.x + a.n.box.y - (b.n.box.x + b.n.box.y))
const envOrder = envs.map((e, i) => ({ e, i })).sort((a, b) => a.e.box.x + a.e.box.y - (b.e.box.x + b.e.box.y))

// Dashed risers: site -> node and node -> environment.
const riser = (x: number, y: number, z0: number, z1: number) => {
  const [ax, ay] = pt(x, y, z0)
  const [, by] = pt(x, y, z1)
  return `M${ax} ${ay} L${ax} ${by}`
}
const nodeRisers = nodes.map((n) => riser(...centre(n.box), floor.h, n.box.z))
const envRisers = envs.map((e) => riser(...centre(e.box), nodes[e.node]!.box.z + nodes[e.node]!.box.h, e.box.z))

// Rack-server face detail: vent lines on the front-left face of each x86 node.
const vents = (b: Box) =>
  [0.25, 0.45, 0.65, 0.85].map((u) => {
    const [ax, ay] = pt(b.x + u, b.y + b.d, b.z + 0.12)
    const [bx, by] = pt(b.x + u, b.y + b.d, b.z + b.h - 0.12)
    return `M${ax} ${ay} L${bx} ${by}`
  })

const root = ref<HTMLElement | null>(null)
const reduced = usePrefersReducedMotion()
const step = useStepLoop(root, tour.map(() => 2300), 0)
const active = computed(() => {
  const env = tour[step.value]!
  const node = envs[env]!.node
  return { env, node, pin: node }
})

// Inside the scaled stack: site -> node -> environment.
const pulse = computed(() => {
  const e = envs[active.value.env]!
  const n = nodes[active.value.node]!
  const [px, py] = pt(...centre(n.box), floor.h)
  const [, ny] = pt(...centre(n.box), n.box.z)
  const [nx2, ny2] = pt(...centre(e.box), n.box.z + n.box.h)
  const [, ey] = pt(...centre(e.box), e.box.z)
  return `M${px} ${py} L${px} ${ny} M${nx2} ${ny2} L${nx2} ${ey}`
})
// Assemble once on first sight: floor, then nodes, then environments drop into place.
const seen = useSeenOnce(root, 0.2)
watch(seen, (v) => {
  if (!v || reduced.value || !root.value) return
  root.value.querySelectorAll<SVGGElement>('.layer').forEach((g, i) => {
    select(g)
      .style('opacity', 0)
      .style('transform', 'translate(0px, -26px)')
      .transition()
      .delay(120 + i * 220)
      .duration(620)
      .ease(easeCubicOut)
      .style('opacity', 1)
      .style('transform', 'translate(0px, 0px)')
  })
})
</script>

<template>
  <div ref="root" class="flex flex-1 flex-col">
    <IsoStage
      :view-box="viewBox"
      :min-height="380"
      :shrink-vw="100"
      bare
      :label="t('hero.figure')"
    >
      <g :transform="`scale(${K})`">
      <!-- layer 1: data centers -->
      <g class="layer">
        <IsoBox v-bind="floor" />
        <g v-for="([x, y], i) in pins" :key="`pin-${i}`" class="pin" :class="{ 'is-active': i === active.pin }">
          <ellipse :cx="pt(x, y, floor.h)[0]" :cy="pt(x, y, floor.h)[1]" rx="5" ry="2.6" class="pin-halo" />
          <circle :cx="pt(x, y, floor.h)[0]" :cy="pt(x, y, floor.h)[1]" r="2" class="pin-dot" />
        </g>
      </g>

      <path v-for="(d, i) in nodeRisers" :key="`nr-${i}`" :d="d" class="iso-wire" />

      <!-- layer 2: nodes -->
      <g class="layer">
        <g v-for="{ n, i } in nodeOrder" :key="`node-${i}`">
          <IsoBox v-bind="n.box" :tone="i === active.node ? 'accent' : 'base'" />
          <path v-for="(d, k) in vents(n.box)" :key="k" :d="d" class="vent" />
        </g>
      </g>

      <path v-for="(d, i) in envRisers" :key="`er-${i}`" :d="d" class="iso-wire" />

      <!-- layer 3: environments -->
      <g class="layer">
        <g v-for="{ e, i } in envOrder" :key="e.name">
          <IsoBox v-bind="e.box" :tone="i === active.env ? 'accent' : 'base'" />
          <g :transform="topPlane(e.box.x + (C - LOGO) / 2, e.box.y + (C - LOGO) / 2, e.box.z + e.box.h)">
            <g :transform="`scale(${LOGO / 24})`" :class="['env-logo', { 'is-active': i === active.env }]">
              <path :d="e.icon.path" />
            </g>
          </g>
        </g>
      </g>

      <path :d="pulse" class="iso-wire is-accent is-flowing pulse" />
      </g>

      <g class="max-sm:hidden">
        <IsoLabel v-for="l in labels" :key="l.text" v-bind="l" />
      </g>

    </IsoStage>
  </div>
</template>

<style scoped>
.pin-dot {
  fill: #84817b;
  transition: fill 0.3s ease;
}
.pin-halo {
  fill: none;
  stroke: transparent;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  transition: stroke 0.3s ease;
}
.pin.is-active .pin-dot {
  fill: var(--color-primary);
}
.pin.is-active .pin-halo {
  stroke: rgb(128 154 239 / 0.6);
}
.vent {
  stroke: #4a463f;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.env-logo path {
  fill: #84817b;
  transition: fill 0.3s ease;
}
.env-logo.is-active path {
  fill: #ffffff;
}
.pulse {
  stroke-width: 1.4;
}
</style>
