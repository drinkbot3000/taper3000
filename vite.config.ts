import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Vite Configuration with PWA Support
 *
 * Modern build tool configuration using Vite for:
 * - Fast HMR (Hot Module Replacement) during development
 * - Optimized production builds with code splitting
 * - PWA capabilities with service worker generation
 */
export default defineConfig({
  plugins: [
    react(),

    // PWA Plugin Configuration
    // Automatically generates service worker and manifest
    VitePWA({
      // Register service worker with auto-update behavior
      registerType: 'autoUpdate',

      // Include assets in the service worker precache
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

      // Web App Manifest configuration
      // Defines how the app appears when installed
      manifest: {
        name: 'Taper Todo - PWA Task Manager',
        short_name: 'TaperTodo',
        description: 'A modern, offline-capable todo list application',
        theme_color: '#2563eb',
        background_color: '#ffffff',

        // Display mode for installed app
        // 'standalone' hides browser UI for native-like experience
        display: 'standalone',

        // Orientation preference
        orientation: 'portrait',

        // App icons for different platforms and sizes
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],

        // Share target API for receiving shared content
        share_target: {
          action: '/share-target/',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            title: 'title',
            text: 'text'
          }
        }
      },

      // Workbox options for service worker generation
      workbox: {
        // Cache strategy configuration
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache API responses with network-first strategy
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          }
        ],

        // Files to precache on service worker install
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },

      // Development options
      devOptions: {
        enabled: true, // Enable PWA in development mode for testing
        type: 'module'
      }
    })
  ],

  // Server configuration
  server: {
    port: 3000,
    strictPort: false,

    // Enable HTTPS in development (required for some PWA features)
    // https: true
  },

  // Build options
  build: {
    // Target modern browsers for smaller bundles
    target: 'esnext',

    // Output directory
    outDir: 'dist',

    // Source maps for debugging production issues
    sourcemap: true,

    // Rollup options for advanced bundling
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
