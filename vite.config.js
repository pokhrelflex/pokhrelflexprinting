import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/',

  root: './frontend',
  publicDir: './public',

  server: {
    port: 3300,
    host: '127.0.0.1',
    strictPort: true,
    hmr: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    port: process.env.PORT || 3300,
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      'src': path.resolve(__dirname, './frontend/src'),
      'components': path.resolve(__dirname, './frontend/src/components'),
      'utils': path.resolve(__dirname, './frontend/src/utils'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  build: {
    sourcemap: true,
    outDir: '../dist'
  }
});
