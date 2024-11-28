import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Define the aliases function to map the paths
const aliases = (prefix = 'src') => ({
  '@fuse': path.resolve(__dirname, `${prefix}/@fuse`),
  '@history': path.resolve(__dirname, `${prefix}/@history`),
  '@lodash': path.resolve(__dirname, `${prefix}/@lodash`),
  '@mock-api': path.resolve(__dirname, `${prefix}/@mock-api`),
  'app/store': path.resolve(__dirname, `${prefix}/app/store`),
  'app/shared-components': path.resolve(__dirname, `${prefix}/app/shared-components`),
  'app/configs': path.resolve(__dirname, `${prefix}/app/configs`),
  'app/theme-layouts': path.resolve(__dirname, `${prefix}/app/theme-layouts`),
  'app/AppContext': path.resolve(__dirname, `${prefix}/app/AppContext`),
});

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: aliases('src'),  // Use the aliases here
  },
});
