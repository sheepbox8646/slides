// Build every deck under slides/ into one static site for Cloudflare.
//
//   dist/index.html          list of decks
//   dist/<deck>/...          each deck, built with base /<deck>/
//
// Deep links inside a deck (/<deck>/9) are rewritten to /<deck>/index.html by worker.js.
//
// Usage: pnpm run build            (all decks)
//        pnpm run build 2026-11-15 (only the named decks)

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const slidesDir = join(root, 'slides')
const dist = join(root, 'dist')
const slidev = join(root, 'node_modules', '.bin', 'slidev')

const only = process.argv.slice(2)
const decks = readdirSync(slidesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(slidesDir, d.name, 'slides.md')))
  .map((d) => d.name)
  .filter((name) => only.length === 0 || only.includes(name))
  .sort()

if (decks.length === 0) {
  console.error('No decks found under slides/.')
  process.exit(1)
}

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

const built = []
for (const name of decks) {
  const cwd = join(slidesDir, name)
  console.log(`\n▶ building ${name} → /${name}/`)
  execFileSync(slidev, ['build', '--base', `/${name}/`, '--out', join(dist, name)], { cwd, stdio: 'inherit' })
  // Slidev writes _redirects/404.html for root deployment; deep links are handled by worker.js instead.
  rmSync(join(dist, name, '_redirects'), { force: true })
  rmSync(join(dist, name, '404.html'), { force: true })
  const md = readFileSync(join(cwd, 'slides.md'), 'utf8')
  const title = md.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? name
  built.push({ name, title })
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
writeFileSync(
  join(dist, 'index.html'),
  `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Slides</title>
<style>
  body { margin: 0; min-height: 100vh; background: #111; color: #eee; font: 16px/1.6 system-ui, sans-serif; }
  main { max-width: 720px; margin: 0 auto; padding: 64px 24px; }
  h1 { font-size: 28px; margin: 0 0 32px; }
  a { display: block; padding: 16px 20px; margin-bottom: 12px; border-radius: 12px; background: #1c1c1c; color: inherit; text-decoration: none; }
  a:hover { background: #262626; }
  small { display: block; color: #888; font-family: ui-monospace, monospace; }
</style>
<main>
  <h1>Slides</h1>
${built
  .slice()
  .reverse()
  .map(({ name, title }) => `  <a href="/${name}/"><small>${esc(name)}</small>${esc(title)}</a>`)
  .join('\n')}
</main>
</html>
`,
)

console.log(`\n✓ built ${built.length} deck(s) into dist/`)
