import { ref } from 'vue'

// True isometric projection helpers for the feature diagrams.
// World axes: +x runs down-right, +y runs down-left, +z runs up. One world unit is UNIT px.

export const UNIT = 24
export const C30 = Math.cos(Math.PI / 6)

export type V3 = [number, number, number]
export type IsoTone = 'base' | 'accent' | 'ghost' | 'danger'
export type P2 = [number, number]

export function pt(x: number, y: number, z: number): P2 {
  return [(x - y) * C30 * UNIT, ((x + y) * 0.5 - z) * UNIT]
}

export function poly(points: V3[]): string {
  return 'M' + points.map((p) => pt(...p).map((n) => n.toFixed(2)).join(' ')).join('L') + 'Z'
}

export interface Box {
  x: number
  y: number
  z: number
  w: number
  d: number
  h: number
}

/** The three faces a viewer sees: top, left (+y face) and right (+x face). */
export function boxFaces({ x, y, z, w, d, h }: Box) {
  const x1 = x + w
  const y1 = y + d
  const z1 = z + h
  return {
    top: poly([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]]),
    left: poly([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]]),
    right: poly([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]]),
  }
}

export function boxCorners({ x, y, z, w, d, h }: Box): V3[] {
  const out: V3[] = []
  for (const cx of [x, x + w]) for (const cy of [y, y + d]) for (const cz of [z, z + h]) out.push([cx, cy, cz])
  return out
}

/** SVG transform that maps local (u, v) world units onto the top plane at (x, y, z). */
export function topPlane(x: number, y: number, z: number): string {
  const [e, f] = pt(x, y, z)
  const a = C30 * UNIT
  const b = 0.5 * UNIT
  return `matrix(${a.toFixed(4)} ${b.toFixed(4)} ${(-a).toFixed(4)} ${b.toFixed(4)} ${e.toFixed(2)} ${f.toFixed(2)})`
}

/** Screen-space offset for a move in world space, as a CSS/SVG translate. */
export function shift(dx: number, dy: number, dz: number): string {
  const [sx, sy] = pt(dx, dy, dz)
  return `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px)`
}

/** Semi-axes of a circle of radius r lying in the top plane. */
export function isoEllipse(r: number) {
  return { rx: r * Math.SQRT2 * C30 * UNIT, ry: r * Math.SQRT2 * 0.5 * UNIT }
}

/** viewBox that fits the given world points plus screen-space extras, with padding. */
export function fit(points: V3[], extra: P2[] = [], pad = 14): string {
  const all = [...points.map((p) => pt(...p)), ...extra]
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const x0 = Math.min(...xs) - pad
  const y0 = Math.min(...ys) - pad
  const w = Math.max(...xs) - Math.min(...xs) + pad * 2
  const h = Math.max(...ys) - Math.min(...ys) + pad * 2
  return `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`
}

// On phones the callouts are drawn larger and without their second line (see style.css),
// so frames are sized for that. Reactive: drawings re-fit when the viewport crosses 640px.
export const compactLabels = ref(false)
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(max-width: 640px)')
  compactLabels.value = mq.matches
  mq.addEventListener('change', (e) => (compactLabels.value = e.matches))
}

// CJK, full-width punctuation and kana: about one em wide, against about 0.6 em for Fira Code.
const WIDE = /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/

/** Approximate width of monospace callout text at the given font size. */
export function textWidth(text: string, fontSize: number): number {
  let w = 0
  for (const ch of text) w += WIDE.test(ch) ? fontSize : fontSize * 0.61
  return w
}

/** Approximate screen extent of an IsoLabel, so fit() can keep callouts inside the frame. */
export function labelExtent(at: V3, dx: number, dy: number, text: string, sub = ''): P2[] {
  const [ax, ay] = pt(...at)
  const dir = dx < 0 ? -1 : 1
  const by = ay + dy
  const compact = compactLabels.value
  if (compact) sub = ''
  const width = 12 + Math.max(textWidth(text, compact ? 14 : 10), textWidth(sub, 9))
  return [
    [ax, ay],
    [ax + dx + dir * width, by - 9],
    [ax + dx + dir * width, by + (sub ? 17 : 5)],
  ]
}

/**
 * SVG transform that maps local (u, v) world units onto the vertical +y face at (x, y, z):
 * u runs along +x, v runs downward. Used to print onto screens that face the viewer's left.
 */
export function frontPlane(x: number, y: number, z: number): string {
  const [e, f] = pt(x, y, z)
  return `matrix(${(C30 * UNIT).toFixed(4)} ${(0.5 * UNIT).toFixed(4)} 0 ${UNIT} ${e.toFixed(2)} ${f.toFixed(2)})`
}
