import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Fully static output, deployable to GitHub Pages.
  output: 'static',
  // Update to your real GitHub Pages URL.
  // User/org site (repo named <user>.github.io): leave `base` unset.
  // Project site (repo named e.g. "jamedonelle"): set base: '/jamedonelle'.
  site: 'https://jamedonelle.github.io',
  // base: '/jamedonelle',
});
