import { defineConfig, presetWebFonts } from 'unocss'

export default defineConfig({
  safelist: [
    ...Array.from({ length: 30 }, (_, i) => `delay-${(i + 1) * 100}`),
  ],
  presets: [
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        cn: 'Noto Serif SC',
      },
      timeouts: {
        failure: 30000,
        warning: 30000,
      },
    }),
  ],
})
