import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  base: '/pdfa/',
  plugins: [
    react(),
    tsconfigPaths()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pdfa.dimosaic.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // Use pure_funcs to remove only specific console methods
        pure_funcs: ['console.log', 'console.debug'],
      },
    }
  }

})
