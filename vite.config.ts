/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.BUILD
 * TAG: LEEWAY.APP.BUILD.VITE
 * WHAT: Vite configuration for local development and GitHub Pages builds.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: vite.config.ts
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // GitHub Pages project sites serve assets under the repository prefix.
    base: process.env.GITHUB_ACTIONS === 'true' ? '/Leeway-office-suites/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR may be disabled through the LeeWay host adapter during governed edits.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.LEEWAY_DISABLE_HMR !== 'true',
      // Disable file watching when LeeWay host editing is active to save CPU.
      watch: process.env.LEEWAY_DISABLE_HMR === 'true' ? null : {},
    },
  };
});
