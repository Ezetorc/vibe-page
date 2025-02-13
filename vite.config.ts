import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import compression from 'vite-plugin-compression'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        headers: {
          'Accept-Encoding': 'gzip, br' 
        }
      }
    }
  },
  plugins: [
    react(),
    mkcert(),
    compression({ algorithm: 'brotliCompress' }),
    compression({ algorithm: 'gzip' })
  ]
})
