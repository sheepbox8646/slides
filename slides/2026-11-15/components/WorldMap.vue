<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { geoNaturalEarth1, geoPath, type GeoProjection } from 'd3-geo'
import { select } from 'd3-selection'
import 'd3-transition'
import { easeCubicInOut } from 'd3-ease'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type { Feature, FeatureCollection, MultiPoint } from 'geojson'
import { onSlideEnter } from '@slidev/client'
import { usePrefersReducedMotion } from '../composables/motion'

// Ported from kibotos-landing WorldMap. Regions come in as props instead of i18n + mock data.
interface Region {
  id: string
  name: string
  lon: number
  lat: number
  label: 'left' | 'right' | 'top' | 'bottom'
  /** Not live yet: drawn hollow, links faint. */
  soon?: boolean
}
const props = defineProps<{ regions: Region[]; backbone: [string, string][] }>()

const active = defineModel<string | null>('active', { default: null })

const wrap = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const arcLayer = ref<SVGGElement | null>(null)
const size = ref({ w: 0, h: 0 })
const markers = ref<(Region & { x: number; y: number })[]>([])
const arcs = ref<{ key: string; d: string; soon: boolean }[]>([])
const revealed = ref(false)

const seen = ref(false)
onSlideEnter(() => { seen.value = true })
const reduced = usePrefersReducedMotion()

let land: FeatureCollection | Feature | null = null
let observer: ResizeObserver | null = null

// The visible window runs east from Europe across Asia and the Pacific to the US west coast,
// so every region fits and the Pacific crossing stays in the middle.
const LON_MIN = 60
const LON_MAX = 250
const LAT_MIN = -6
const LAT_MAX = 52
const wrapLon = (lon: number) => (lon > 180 ? lon - 360 : lon)
const frame: MultiPoint = (() => {
  const coordinates: [number, number][] = []
  for (let lon = LON_MIN; lon <= LON_MAX; lon += 4) {
    coordinates.push([wrapLon(lon), LAT_MIN], [wrapLon(lon), LAT_MAX])
  }
  for (let lat = LAT_MIN; lat <= LAT_MAX; lat += 4) {
    coordinates.push([wrapLon(LON_MIN), lat], [wrapLon(LON_MAX), lat])
  }
  return { type: 'MultiPoint', coordinates }
})()

function project(projection: GeoProjection, r: Region) {
  const [x, y] = projection([r.lon, r.lat])!
  return { ...r, x, y }
}

function render() {
  const el = wrap.value
  const cv = canvas.value
  if (!el || !cv || !land) return
  const w = el.clientWidth
  if (!w) return

  const projection = geoNaturalEarth1().rotate([-(LON_MIN + LON_MAX) / 2, 0]).fitWidth(w, frame)
  const h = Math.ceil(geoPath(projection).bounds(frame)[1][1])
  size.value = { w, h }

  // Rasterise land once, then sample it on a grid to get the dot pattern.
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const octx = off.getContext('2d', { willReadFrequently: true })!
  octx.fillStyle = '#fff'
  octx.beginPath()
  geoPath(projection, octx)(land)
  octx.fill()
  const pixels = octx.getImageData(0, 0, w, h).data

  const dpr = window.devicePixelRatio || 1
  cv.width = Math.round(w * dpr)
  cv.height = Math.round(h * dpr)
  cv.style.width = `${w}px`
  cv.style.height = `${h}px`
  const ctx = cv.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(246, 239, 229, 0.22)'

  const gap = Math.max(5, Math.round(w / 165))
  const radius = gap * 0.2
  ctx.beginPath()
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      if (pixels[((y | 0) * w + (x | 0)) * 4 + 3]! > 127) {
        ctx.moveTo(x + radius, y)
        ctx.arc(x, y, radius, 0, Math.PI * 2)
      }
    }
  }
  ctx.fill()

  markers.value = props.regions.map((r) => project(projection, r))
  const path = geoPath(projection)
  arcs.value = props.backbone.map(([a, b]) => {
    const ra = props.regions.find((r) => r.id === a)!
    const rb = props.regions.find((r) => r.id === b)!
    return {
      key: `${a}-${b}`,
      d: path({ type: 'LineString', coordinates: [[ra.lon, ra.lat], [rb.lon, rb.lat]] }) ?? '',
      soon: !!(ra.soon || rb.soon),
    }
  })
}

async function drawArcs() {
  if (revealed.value) return
  revealed.value = true
  await nextTick()
  if (reduced.value || !arcLayer.value) return
  select(arcLayer.value)
    .selectAll<SVGPathElement, unknown>('path.arc')
    .each(function (_, i) {
      const length = this.getTotalLength()
      select(this)
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .delay(300 + i * 160)
        .duration(1200)
        .ease(easeCubicInOut)
        .attr('stroke-dashoffset', 0)
        .on('end', function () {
          select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
        })
    })
}

watch(() => props.regions, () => render(), { deep: true })

watch([seen, size], ([isSeen, s]) => {
  if (isSeen && s.w) drawArcs()
})

onMounted(async () => {
  const topo = (await import('world-atlas/land-110m.json')).default as unknown as Topology<{ land: GeometryCollection }>
  land = feature(topo, topo.objects.land)
  render()
  let lastWidth = wrap.value?.clientWidth ?? 0
  observer = new ResizeObserver(() => {
    const w = wrap.value?.clientWidth ?? 0
    if (w === lastWidth) return
    lastWidth = w
    if (arcLayer.value) {
      select(arcLayer.value).selectAll('path.arc').interrupt().attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
    }
    render()
  })
  if (wrap.value) observer.observe(wrap.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  if (arcLayer.value) select(arcLayer.value).selectAll('path.arc').interrupt()
})

const labelPos = (side: Region['label']) => {
  switch (side) {
    case 'left':
      return { x: -11, y: 4, anchor: 'end' }
    case 'right':
      return { x: 11, y: 4, anchor: 'start' }
    case 'top':
      return { x: 0, y: -12, anchor: 'middle' }
    default:
      return { x: 0, y: 20, anchor: 'middle' }
  }
}
</script>

<template>
  <div ref="wrap" class="relative w-full" :style="{ height: size.h ? `${size.h}px` : undefined }">
    <div v-if="!size.h" class="aspect-[2.3/1] w-full" />
    <canvas ref="canvas" class="map-fade absolute inset-0" aria-hidden="true" />
    <svg
      v-if="size.w"
      class="absolute inset-0 overflow-visible"
      :viewBox="`0 0 ${size.w} ${size.h}`"
      :width="size.w"
      :height="size.h"
      role="img"
      :aria-label="props.regions.map((r) => r.name).join('、')"
    >
      <g ref="arcLayer" :style="{ opacity: revealed ? 1 : 0 }">
        <path v-for="a in arcs" :key="a.key" class="arc" :class="{ 'arc-soon': a.soon }" :d="a.d" />
      </g>
      <g
        v-for="(m, i) in markers"
        :key="m.id"
        :transform="`translate(${m.x},${m.y})`"
        class="marker"
        :class="{ 'is-active': active === m.id, 'is-soon': m.soon }"
        @mouseenter="active = m.id"
        @mouseleave="active = null"
      >
        <circle r="14" fill="transparent" />
        <circle v-if="!m.soon" r="4" class="pulse" :style="{ animationDelay: `${i * 0.37}s` }" />
        <circle r="4" class="dot" />
        <text
                    :x="labelPos(m.label).x"
          :y="labelPos(m.label).y"
          :text-anchor="labelPos(m.label).anchor"
        >{{ m.name }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
/* Fade the dot field out at the frame edges so the crop does not read as a hard box. */
.map-fade {
  mask-image:
    linear-gradient(to right, transparent, #000 7%, #000 93%, transparent),
    linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
  mask-composite: intersect;
}
.arc {
  fill: none;
  stroke: rgb(128 154 239 / 0.6);
  stroke-width: 1.2;
  stroke-linecap: round;
}
.marker {
  cursor: default;
}
.marker .dot {
  fill: var(--color-primary);
  stroke: #2e2b26;
  stroke-width: 2;
  transition: transform 0.25s ease;
  transform-box: fill-box;
  transform-origin: center;
}
.marker .pulse {
  fill: var(--color-primary);
  transform-box: fill-box;
  transform-origin: center;
  animation: node-pulse 2.6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
}
.marker text {
  font-size: 13px;
  font-weight: 500;
  fill: var(--color-muted-foreground);
  transition: fill 0.2s ease;
}
/* Coming-soon regions: hollow, no pulse, faint links. A CSS dash beats the draw-in attribute. */
.arc-soon {
  stroke: rgb(255 255 255 / 0.14);
  stroke-dasharray: 3 4;
}
.marker.is-soon .dot {
  fill: #2e2b26;
  stroke: #84817b;
  stroke-width: 1.4;
}
.marker.is-soon text {
  fill: #7a7771;
}
.marker.is-active .dot {
  transform: scale(1.5);
}
.marker.is-active text {
  fill: var(--color-foreground);
}
</style>
