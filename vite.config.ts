import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for production - important for Netlify
  base: '',
  build: {
    // Output directory that will be served
    outDir: 'dist',
    // Clean the output directory before build
    emptyOutDir: true,
    // Optimize bundle size
    minify: 'terser',
    // Generate sourcemaps for debugging
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      // Explicitly exclude test files from the build
      external: [
        // Exclude test files
        /\.test\.tsx?$/,
        /\.spec\.tsx?$/,
        // Exclude test directories and files
        /[\\/]tests[\\/]/,
        /[\\/]__tests__[\\/]/,
        '@jest/globals'
      ]
    }
  },
  // Optimize dev server
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
})
