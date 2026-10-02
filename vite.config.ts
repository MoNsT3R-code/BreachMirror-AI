import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {authPlugin} from './server/auth-plugin';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), authPlugin(env.GEMINI_API_KEY)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }
            if (
              id.includes('/node_modules/d3/') ||
              id.includes('/node_modules/d3-') ||
              id.includes('/node_modules/internmap/')
            ) {
              return 'vendor-d3';
            }
            if (
              id.includes('/node_modules/motion/') ||
              id.includes('/node_modules/motion-')
            ) {
              return 'vendor-motion';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
