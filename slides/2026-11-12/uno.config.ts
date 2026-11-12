import { defineConfig } from 'unocss'

// Design tokens copied from kibotos-landing/src/style.css (which follows the Kibotos brand manual).
// Base Black page, warm greys from the manual's grayscale, Collab Blue as the single accent.
export default defineConfig({
  theme: {
    colors: {
      background: '#2e2b26',
      foreground: '#ffffff',
      muted: '#abaaa8', // Stone
      subtle: '#82807d', // Gray
      card: '#36332d',
      inset: '#282520',
      line: '#46423b',
      primary: '#809aef', // Collab Blue
      cloud: '#bbcdf1', // Cloud Blue
      space: '#f6efe5', // Space White
      danger: '#f87171',
      ok: '#4ade80',
    },
    fontFamily: {
      sans: '"Poppins", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", ui-sans-serif, system-ui, sans-serif',
      mono: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, "PingFang SC", monospace',
    },
  },
  shortcuts: {
    // .section-title / .section-subtitle from the landing, sized for a 980 x 552 slide canvas.
    'k-title': 'font-sans font-bold text-foreground tracking-[-0.01em] leading-[1.2]',
    'k-sub': 'text-muted leading-relaxed',
    'k-card': 'rounded-3xl bg-card',
    'k-mono': 'font-mono text-[11px] text-[#a29f99]',
    'k-kicker': 'text-[11px] font-semibold tracking-[0.08em] uppercase text-muted',
  },
})
