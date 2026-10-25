import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://rafikbahri.com",
  integrations: [sitemap(), mdx(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline assets as base64 data URIs. @fontsource ships small woff2
      // subsets that fall under Vite's 4 KB default, and inlining them into the
      // single site-wide stylesheet adds ~120 KB of incompressible base64 to
      // every page. Separate font files are cached once and fetched only for
      // the subsets a page actually needs.
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
