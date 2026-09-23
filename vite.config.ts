import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// Preloads the hashed Inter latin woff2 so it is fetched in parallel with the CSS (build only).
const preloadInterLatin = (): Plugin => ({
  name: 'preload-inter-latin',
  apply: 'build',
  transformIndexHtml(_html, ctx) {
    const font = Object.keys(ctx.bundle ?? {}).find((f) => /inter-latin-opsz-normal-.*\.woff2$/.test(f))
    return font
      ? [{ tag: 'link', attrs: { rel: 'preload', href: `/${font}`, as: 'font', type: 'font/woff2', crossorigin: '' }, injectTo: 'head-prepend' }]
      : []
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadInterLatin()],
})
