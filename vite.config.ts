import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ultra-fast build optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split chunks for faster loading
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  server: {
    // Development optimizations
    hmr: {
      overlay: false, // Disable error overlay for faster dev
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies for instant loading
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
