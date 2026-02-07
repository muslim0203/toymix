import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // Proxy API requests to the ToyMix bot API server
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [
        tailwindcss(),
        react(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // SEO: Minify for performance (esbuild is Vite default)
        sourcemap: false,
        minify: 'esbuild',
        // SEO: Optimize chunk splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              firebase: ['firebase/app', 'firebase/auth'],
            },
          },
        },
        // SEO: Target modern browsers for smaller bundles
        target: 'es2020',
        // SEO: CSS code splitting
        cssCodeSplit: true,
      },
    };
});
