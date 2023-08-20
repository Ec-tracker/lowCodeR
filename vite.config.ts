import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [tsconfigPaths(), react()],

  css: {
    modules: {
      hashPrefix: 'prefix',
    },

    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
