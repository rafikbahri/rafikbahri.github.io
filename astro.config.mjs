import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  site: "https://rafikbahri.com",
  integrations: [sitemap(), mdx(), pagefind(), icon()],
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
    // Heading IDs must exist before the autolink plugin adds the "#" links
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          // data-pagefind-ignore keeps the "#" out of the search index and excerpts
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Link to this section",
            dataPagefindIgnore: true,
          },
          content: { type: "text", value: "#" },
        },
      ],
    ],
  },
});
