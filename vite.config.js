import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repository name for GitHub Pages
const getBase = () => {
  // Replace 'your-repo-name' with your actual GitHub repository name
  // Or dynamically get it from environment variables
  return process.env.GITHUB_REPOSITORY ? 
    `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : 
    '/';
};

export default defineConfig({
  plugins: [react()],
  base: getBase(), // This sets the base URL for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})