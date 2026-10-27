import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('mermaid') || id.includes('cytoscape') || id.includes('dagre') || id.includes('katex')) {
              return 'vendor-mermaid';
            }
            if (id.includes('motion')) {
              return 'vendor-motion';
            }
            if (id.includes('react-router') || id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-router-redux';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
