import { defineAppSetup } from '@slidev/types'

// Kibotos brand typefaces, self-hosted so the deck works offline on stage.
// Poppins for everything Latin (brand manual 3.0), Fira Code for the mono callouts the landing uses.
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/fira-code/400.css'

// `$asset('/logos/x.svg')` resolves a public/ path against the deploy base (e.g. /2026-11-15/).
// Static src="/..." attributes are rewritten by Vite; bound :src values are not, so use this for them.
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')

export default defineAppSetup(({ app }) => {
  app.config.globalProperties.$asset = asset
})
