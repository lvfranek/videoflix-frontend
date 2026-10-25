import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Port 5500 on 127.0.0.1, because the local backend allows CORS only from there
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5500, strictPort: true },
  preview: { host: '127.0.0.1', port: 5500, strictPort: true },
})
