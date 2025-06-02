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
        // Exclude all test-related files
        /[\\/]tests[\\/]/,
        /[\\/]__tests__[\\/]/,
        /test-hands/,
        /test-runner/,
        /pattern-calculator\.test/,
        '@jest/globals'
      ],
      output: {
        // Ensure proper chunk naming and paths
        manualChunks(id) {
          // Group test files separately to ensure they're not included
          if (id.includes('test') || id.includes('jest')) {
            return 'tests';
          }
        }
      }
    }
  },
  // Optimize dev server
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
})
