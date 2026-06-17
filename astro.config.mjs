import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import process from 'node:process';

// Only use Cloudflare adapter for Cloudflare build or production build
const isCloudflareBuild = !!process.env.CF_PAGES || process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'prod';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.qultre.com',
  adapter: isCloudflareBuild ? cloudflare() : undefined,
  server: {
    host: true,
    port: 4321,
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    server: {
      allowedHosts: ['localhost', 'qultre.local.besselsolutions.com', 'qultre.com'],
      cors: true
    }
  },
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    mdx(),
    sitemap()
  ]
});
