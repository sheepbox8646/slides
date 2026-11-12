<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { max } from 'd3-array'
import { easeCubicOut } from 'd3-ease'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { onSlideEnter } from '@slidev/client'
import { usePrefersReducedMotion } from '../composables/motion'

export interface BarRow {
  name: string
  value: number
  /** Text shown at the end of the bar, e.g. "$791/mo". */
  label: string
  /** Optional right-most column, e.g. "4.1x". */
  note?: string
  highlight?: boolean
}

const props = withDefaults(
  defineProps<{
    rows: BarRow[]
    label: string
    rowHeight?: number
  }>(),
  { rowHeight: 34 },
)

const wrap = ref<HTMLDivElement | null>(null)
const svgEl = ref<SVGSVGElement | null>(null)
const reduced = usePrefersReducedMotion()
let observer: ResizeObserver | null = null
let lastWidth = 0

const BAR_HEIGHT = 8
const NOTE_WIDTH = 54
const GAP = 14

function draw(animate: boolean) {
  const el = wrap.value
  const svg = svgEl.value
  if (!el || !svg) return
  const width = el.clientWidth
  if (!width) return
  lastWidth = width

  const labelWidth = width < 480 ? 132 : 168
  const valueWidth = width < 480 ? 76 : 96
  const hasNotes = props.rows.some((r) => r.note)
  const right = width - (hasNotes ? NOTE_WIDTH : 0)
  const barSpace = Math.max(40, right - valueWidth - labelWidth - GAP)
  const height = props.rows.length * props.rowHeight

  const x = scaleLinear()
    .domain([0, max(props.rows, (d) => d.value) ?? 1])
    .range([0, barSpace])

  const root = select(svg).attr('viewBox', `0 0 ${width} ${height}`).attr('height', height)
  const t = transition()
    .duration(animate && !reduced.value ? 750 : 0)
    .ease(easeCubicOut)

  const rows = root
    .selectAll<SVGGElement, BarRow>('g.row')
    .data(props.rows, (d) => d.name)
    .join(
      (enter) => {
        const g = enter
          .append('g')
          .attr('class', 'row')
          .attr('transform', (_, i) => `translate(0,${i * props.rowHeight})`)
        g.append('text').attr('class', 'name').attr('dominant-baseline', 'central')
        g.append('rect').attr('class', 'bar').attr('width', 0)
        g.append('text').attr('class', 'value').attr('dominant-baseline', 'central').attr('text-anchor', 'end')
        g.append('text').attr('class', 'note').attr('dominant-baseline', 'central').attr('text-anchor', 'end')
        return g
      },
      (update) => update,
      (exit) => exit.remove(),
    )

  rows.transition(t as never).attr('transform', (_, i) => `translate(0,${i * props.rowHeight})`)

  const mid = props.rowHeight / 2
  rows
    .select<SVGTextElement>('text.name')
    .attr('x', 0)
    .attr('y', mid)
    .text((d) => d.name)
    .attr('class', (d) => `name ${d.highlight ? 'is-highlight' : ''}`)

  rows
    .select<SVGRectElement>('rect.bar')
    .attr('x', labelWidth)
    .attr('y', mid - BAR_HEIGHT / 2)
    .attr('height', BAR_HEIGHT)
    .attr('rx', BAR_HEIGHT / 2)
    .attr('class', (d) => `bar ${d.highlight ? 'is-highlight' : ''}`)
    .transition(t as never)
    .attr('width', (d) => Math.max(BAR_HEIGHT, x(d.value)))

  rows
    .select<SVGTextElement>('text.value')
    .attr('x', right)
    .attr('y', mid)
    .text((d) => d.label)
    .attr('class', (d) => `value ${d.highlight ? 'is-highlight' : ''}`)

  rows
    .select<SVGTextElement>('text.note')
    .attr('x', width)
    .attr('y', mid)
    .text((d) => d.note ?? '')
}

onMounted(() => {
  draw(true)
  observer = new ResizeObserver(() => {
    if (wrap.value && wrap.value.clientWidth !== lastWidth) draw(false)
  })
  if (wrap.value) observer.observe(wrap.value)
})
onBeforeUnmount(() => observer?.disconnect())
// Replay the bars every time the slide comes into view.
onSlideEnter(() => {
  if (svgEl.value) select(svgEl.value).selectAll('rect.bar').attr('width', 0)
  draw(true)
})
watch(() => props.rows, () => draw(true), { deep: true })
</script>

<template>
  <div ref="wrap" class="w-full">
    <svg ref="svgEl" class="bar-chart block w-full" role="img" :aria-label="label" />
    <table class="sr-only">
      <caption>{{ label }}</caption>
      <tbody>
        <tr v-for="r in rows" :key="r.name">
          <th scope="row">{{ r.name }}</th>
          <td>{{ r.label }}</td>
          <td v-if="r.note">{{ r.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.bar-chart :deep(text) {
  font-size: 13px;
  fill: var(--color-muted-foreground);
}
.bar-chart :deep(text.value),
.bar-chart :deep(text.note) {
  font-family: var(--font-mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.bar-chart :deep(text.note) {
  fill: var(--color-subtle);
}
.bar-chart :deep(text.is-highlight) {
  fill: var(--color-foreground);
  font-weight: 600;
}
.bar-chart :deep(rect.bar) {
  fill: #4d4942;
}
.bar-chart :deep(rect.bar.is-highlight) {
  fill: var(--color-primary);
}
</style>
