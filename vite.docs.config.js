import vue from '@vitejs/plugin-vue'

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  root: 'example',
  base: '/',
  ssr: false,

  plugins: [vue()],

  optimizeDeps: {
    include: ["axios"]
  },

  publicDir: ['public'],

  resolve: {
    extensions: ['.js', '.vue', ".mjs"]
  },

  build: {
    outDir: '../docs'
  }
}
