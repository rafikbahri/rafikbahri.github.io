# AGENTS.md

Personal blog of Rafik Bahri, served at **https://rafikbahri.com** (and `www.rafikbahri.com`).
It is a static [Astro 5](https://astro.build) site (based on the *astro-micro* theme) with MDX, Tailwind CSS 4 and Pagefind search, hosted on **Cloudflare Pages**.

## Commands

| Command           | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `npm ci`          | Install dependencies from `package-lock.json`           |
| `npm run dev`     | Local dev server at http://localhost:4321               |
| `npm run build`   | `astro check` (type check) then `astro build` → `dist/` |
| `npm run preview` | Serve the built `dist/` locally (needed to test search) |

Always run `npm run build` before committing: it is exactly what CI runs, and it fails on frontmatter that does not match the content schema.

## Git conventions

- Never commit directly to `master` (every push to it deploys to production). Work on a branch, e.g. `docs/...`, `fix/...`, `feat/...`.
- Commit messages are short, one line, in Conventional Commits style: `<type>: <summary>`, e.g. `fix: Set site URL to rafikbahri.com`, `docs: Add AGENTS.md`, `ci: ...`, `feat: ...`.
- Do not add `Co-Authored-By` trailers or any other attribution lines to commits.
- Commit as `Rafik Bahri <rafikbahri.insat@gmail.com>`. The global git config uses a work email that is not linked to the `rafikbahri` account, so this repo sets `user.email` in its local `.git/config`; check with `git config user.email` in a fresh clone.
- Commits must be GPG-signed.
- Use the `rafikbahri` GitHub account for `gh` and pushes (this machine also has a work account). Check with `gh auth status` and switch with `gh auth switch --user rafikbahri` if needed.
- The default SSH key authenticates as the work account, so `git push` to the SSH `origin` is denied. Push over HTTPS with the `gh` credentials instead:

  ```sh
  git -c credential.helper= -c credential.helper='!gh auth git-credential' \
    push https://github.com/rafikbahri/rafikbahri.github.io.git <branch>
  ```

## Project structure

```
.
├── .github/workflows/deploy.yml   # CI/CD: build + deploy to Cloudflare Pages
├── astro.config.mjs               # Astro integrations: sitemap, mdx, pagefind, tailwind
├── infra/bootstrap/               # Terraform: Cloudflare Pages project + custom domains
├── jobs/bootstrap                 # Script that runs terraform init/plan/apply for infra/bootstrap
├── src/
│   ├── consts.ts                  # Site title, description, email, socials, homepage counts
│   ├── content.config.ts          # Content collections (blog, projects) and their frontmatter schemas
│   ├── content/
│   │   ├── blog/<NN-slug>/index.mdx   # One folder per article
│   │   └── projects/                  # Project entries (collection defined, currently empty)
│   ├── components/                # Astro components (Callout, Giscus comments, TOC, PageFind, ...)
│   ├── layouts/Layout.astro       # Base HTML layout
│   ├── pages/                     # File-based routes: /, /blog, /projects, /tags, /rss.xml, 404
│   ├── lib/utils.ts               # Helpers: cn, formatDate, readingTime
│   ├── styles/global.css          # Tailwind entry + global styles
│   └── types.ts                   # Shared TS types
├── public/                        # Static assets served from the site root (article images, favicon)
├── img/, pdf/                     # Legacy assets from the previous site (CV, certifications)
└── tsconfig.json                  # Path alias: `@/...` → `src/...`
```

Key points:

- Routing is file-based. A blog entry at `src/content/blog/00-bastion-aws-tf/index.mdx` is served at `/blog/00-bastion-aws-tf/`.
- Every listing page (home, blog, tags, RSS, prev/next navigation) filters out entries with `draft: true`.
- The search index is generated at build time by `astro-pagefind` into `dist/pagefind/`. `public/pagefind/` is a stale generated leftover; do not edit it by hand.

## Deployment

Production is **Cloudflare Pages**, project `rafikbahri-com`, production branch `master`.

### Continuous deployment (normal path)

`.github/workflows/deploy.yml` runs on:

- every push to `master`
- manual trigger (`workflow_dispatch`)
- a yearly cron on January 1st (rebuilds so the footer copyright year stays current)

Steps: checkout → Node 25 → `npm ci` → `npm run build` → `wrangler pages deploy dist --project-name=rafikbahri-com --branch=master` via `cloudflare/wrangler-action@v4`.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` (needs Cloudflare Pages edit permission)
- `CLOUDFLARE_ACCOUNT_ID`

So **publishing = pushing/merging to `master`**. There is no staging environment; to preview, use `npm run build && npm run preview` locally.

### Manual deployment (fallback)

```sh
npm ci && npm run build
npx wrangler pages deploy dist --project-name=rafikbahri-com --branch=master
```

### Infrastructure (one-time / rarely changed)

`infra/bootstrap/` holds the Terraform (Cloudflare provider `~> 5.0`) that creates:

- the Pages project `rafikbahri-com` (production branch `master`, `NODE_VERSION=25`)
- custom domains `rafikbahri.com` and `www.rafikbahri.com` attached to the project

The DNS zone `rafikbahri.com` lives in Cloudflare. Apply with `./jobs/bootstrap` from the repo root; it expects `infra/bootstrap/prod.tfvars` (git-ignored) containing `cloudflare_api_token` and `cloudflare_account_id`. Terraform state is local and git-ignored, so do not run this from CI or from a fresh clone without the existing state: it would try to recreate the resources.

## Add an article

1. Create a folder in `src/content/blog/`, prefixed with the next two-digit number to keep ordering readable:

   ```
   src/content/blog/01-my-new-article/index.mdx
   ```

   The folder name becomes the URL slug: `/blog/01-my-new-article/`.

2. Add frontmatter matching the `blog` schema in `src/content.config.ts`:

   ```mdx
   ---
   title: "My New Article"
   description: "One-line summary used in listings, meta tags and RSS."
   date: "2026-10-23"
   tags: ["aws", "terraform"]   # optional, generates /tags/<tag> pages
   draft: true                  # optional, hides the article everywhere while true
   ---

   import Callout from "@/components/Callout.astro";

   ## Introduction
   ...
   ```

   `title`, `description` and `date` are required. Use `.mdx` when you need components, `.md` otherwise.

3. Images: put them in `public/`, prefixed with the article number (e.g. `public/01-diagram.png`), and reference them from the site root:

   ```md
   ![Diagram](/01-diagram.png)
   ```

4. Check locally with `npm run dev`, then `npm run build` to validate the schema and types.
5. Remove `draft: true` (or set it to `false`) when ready, commit, and push to `master`. CI deploys it.

## Delete an article

Prefer unpublishing over deleting if the article might come back: set `draft: true` in its frontmatter and push. The page, its tag entries and its RSS item disappear on the next deploy.

To delete it permanently:

1. Remove the article folder: `git rm -r src/content/blog/<NN-slug>/`
2. Remove its images from `public/` (they share the `<NN>-` prefix): `git rm public/<NN>-*`
3. Search for links to it from other articles: `grep -rn "/blog/<NN-slug>" src/`, and fix them.
4. Run `npm run build` to make sure nothing still references it, then commit and push to `master`.

Deleted URLs fall through to the site's `404` page. No redirects are configured; if the article was widely shared, add a `public/_redirects` file (Cloudflare Pages format, e.g. `/blog/<NN-slug>/ /blog/ 301`).

## Known gaps

- `README.md` describes the old AWS S3 / GitHub Pages hosting and is outdated.
- `public/` still contains unused theme demo images (`astro-*.jpg`, `deploy_*.svg`, ...) and a committed `public/pagefind/` index.
