import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: './',
  
  build: {
    // Output to dist folder
    outDir: 'dist',
    
    // Include all HTML files
    rollupOptions: {
      input: {
        main: 'index.html',
        outpatient: 'outpatient.html'
      }
    }
  },
  
  server: {
    // Open browser on dev server start
    open: '/outpatient.html',
    port: 3000
  }
})
