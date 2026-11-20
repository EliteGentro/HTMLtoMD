import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Regenerate icons after editing public/favicon.svg: npm run generate-pwa-assets
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: '#16a34a' },
    },
  },
  images: ['public/favicon.svg'],
})
