import vue from '@vitejs/plugin-vue'

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [vue()],

  optimizeDeps: {
    include: ["axios"]
  },

  resolve: {
    extensions: ['.js', '.vue']
  },

  build: {
    outDir: 'docs'
  }
}
