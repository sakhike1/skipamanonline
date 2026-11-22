import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SPA + react-helmet-async: crawlers that run JS see per-route title/meta.
// Opt-in: set PRERENDER=1 for production builds to emit static HTML for key routes (vite-plugin-prerender + Puppeteer).
// Leave unset for normal `npm run build` so CI/host machines without Chromium still succeed.

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins: PluginOption[] = [
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
  ];

  if (command === 'build' && process.env.PRERENDER === '1') {
    try {
      const vitePrerender = (await import('vite-plugin-prerender')).default;
      plugins.push(
        vitePrerender({
          staticDir: path.join(__dirname, 'dist'),
          routes: ['/', '/shop', '/printing', '/about', '/virtual-stylist', '/terms', '/privacy'],
        }),
      );
    } catch (e) {
      console.warn('[vite] vite-plugin-prerender not registered:', e);
    }
  }

  // Bundle analyzer (only in analyze mode)
  if (process.env.ANALYZE === 'true') {
    try {
      const { visualizer } = await import('rollup-plugin-visualizer');
      plugins.push(
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html'
        })
      );
    } catch {
      // Plugin not available, skip it
    }
  }

  return {
    base: '/', // Ensure base path is set for production
    plugins,
    optimizeDeps: {
    // Include lucide-react for optimization to prevent ERR_INSUFFICIENT_RESOURCES
    // This bundles icons together instead of loading hundreds of individual files
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'lucide-react', // Include for optimization to prevent resource exhaustion
      'smokey-fluid-cursor',
    ],
    // Pre-bundle large dependencies for faster dev server
    esbuildOptions: {
      target: 'es2020',
      // Tree shaking
      treeShaking: true,
      // Additional optimizations
      legalComments: 'none',
    },
    // Force optimization
    force: false,
    // Fix Windows permission issues
    holdUntilCrawlEnd: false,
  },
  // Clear cache on startup if permission errors occur
  clearScreen: false,
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
    },
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
    // Increase server limits to prevent ERR_INSUFFICIENT_RESOURCES
    // This allows more concurrent connections and larger payloads
    maxHttpHeaderSize: 8192,
    // Fix Windows file watching issues
    watch: {
      usePolling: false,
      interval: 100,
    },
    // Prevent permission errors on Windows
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        // LIVE FIX: never split React into a separate chunk.
        // The `vendor <-> react-vendor` chunk cycle crashes on the live server:
        // `Cannot access '<minified>' before initialization`.
        //
        // Put ALL node_modules into ONE `vendor` chunk to eliminate the cycle.
        manualChunks(id) {
          const norm = id.split('\\').join('/');
          if (norm.includes('/node_modules/')) return 'vendor';
          return undefined;
        },
        chunkFileNames: 'assets/js/[name]-[hash:8].js',
        entryFileNames: 'assets/js/[name]-[hash:8].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash:8].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash:8].[ext]`;
          }
          return `assets/[ext]/[name]-[hash:8].[ext]`;
        },
      },
    },
    // Keep default minifier for stability/perf.
    minify: 'esbuild',
    // Optimize asset handling
    assetsInlineLimit: 2048, // Inline assets smaller than 2kb (more aggressive)
    // Source maps for production debugging (disable for smaller bundle)
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: false,
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Enable CSS minification
    cssMinify: true,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warning limit (in KB)
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  // Note: Vite automatically defines process.env.NODE_ENV based on mode
  // No need to hardcode it - this was causing issues with local development
  };
});
