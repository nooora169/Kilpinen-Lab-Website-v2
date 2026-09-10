import { defineConfig } from 'astro/config';
// GitHub Pages workflow supplies the actual root-domain address.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  build: { format: 'directory' },
});
