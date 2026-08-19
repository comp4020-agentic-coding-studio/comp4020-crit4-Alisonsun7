import { defineConfig } from "astro/config";

// Deployed under the GitHub Pages project-page path
// (comp4020-agentic-coding-studio.github.io/comp4020-crit4-Alisonsun7/), so
// every internal link and asset URL needs this base baked in — Astro (unlike
// the starter's Vite setup) has no relative-base shortcut.
export default defineConfig({
  base: "/comp4020-crit4-Alisonsun7/",
  trailingSlash: "always",
});
