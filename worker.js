// Runs only when no static asset matched (assets are served first).
// Deep links inside a deck, e.g. /2026-11-15/9?clicks=2, fall back to that deck's index.html
// so Slidev's client-side router can take over.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const deck = url.pathname.match(/^\/([^/]+)\//)?.[1]
    if (deck && request.method === 'GET') {
      const index = await env.ASSETS.fetch(new URL(`/${deck}/`, url))
      if (index.ok) {
        return new Response(index.body, { status: 200, headers: index.headers })
      }
    }
    return env.ASSETS.fetch(request)
  },
}
