# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

`vanishcode.com` — a personal blog built with Next.js 14 (App Router), Contentlayer, and MDX, shipped as a **static export** (`output: 'export'`). Repo is `vanishcode/vanishcode`; the production site lives at vanishcode.com.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`).

- `pnpm dev` — dev server at localhost:3000 (Contentlayer regenerates content on change)
- `pnpm build` — production build; with `output: 'export'` this also writes the static site to `out/`
- `pnpm preview` — `next build && next start`
- `pnpm lint` — `next lint` (eslint-config-next, core-web-vitals)

There is no test suite.

Note: the remote default branch is **`master`**, but local work here is on `main`. PRs usually target `master`.

## Architecture

Content is the source of truth. Everything flows: **MDX files → Contentlayer → generated TS → App Router pages**.

- **`content/`** holds all MDX. `contentlayer.config.js` defines two document types:
  - `Post` (`content/posts/**/*.mdx`) — frontmatter `title` (required), `date` (required), `description`. Rendered under `/posts/<slug>`.
  - `Page` (`content/pages/**/*.mdx`) — frontmatter `title` (required), `description`. Rendered at the top-level catch-all `/<slug>` (e.g. `content/pages/resume.mdx` → `/resume`).
  - Both get computed `slug` and `slugAsParams` from the file path.
- **Contentlayer** runs via `withContentlayer` in `next.config.js` and emits typed data + MDX-compiled code to `.contentlayer/generated` (gitignored). Import it as `contentlayer/generated` or `@/.contentlayer/generated` (both aliased in `tsconfig.json`). `allPosts` / `allPages` are the entry points. If imports from there fail, content hasn't been generated yet — run `pnpm dev` or `pnpm build`.
- **Routing** (`app/`, App Router, all statically generated via `generateStaticParams`):
  - `app/page.tsx` — home; lists `allPosts` sorted by `date` desc.
  - `app/posts/[...slug]/page.tsx` — a post; matches on `slugAsParams`.
  - `app/[...slug]/page.tsx` — a page; matches `allPages` on `slugAsParams`.
  - `app/layout.tsx` — shared chrome (header, footer, theme provider, Vercel Analytics).
- **MDX rendering**: `components/mdx-components.tsx` uses `useMDXComponent` (next-contentlayer) to render `post.body.code`. Code blocks are highlighted at build time by **rehype-pretty-code + shiki** (github-light/dark themes, `keepBackground: false`). Custom MDX components are registered in the `components` map there — currently just `next/image`.

## Styling & theming

- **Tailwind** with the typography plugin (`prose` classes render MDX body). Design tokens are CSS variables in `app/globals.css` (`--bg`, `--text`, `--muted`, `--accent`, `--border`, …), exposed to Tailwind as semantic color names in `tailwind.config.js` (`bg`, `ink`, `muted`, `accent`, `line`, `panel`). Use those names (`text-ink`, `border-line`, `text-accent`) rather than hardcoded colors.
- **Dark mode** is class-based via `next-themes` (`.dark` overrides the variables). Toggle UI is `components/mode-toggle.tsx`.
- Font is JetBrains Mono (`next/font/google`), the whole site is monospace.

## Static-export constraints

Because of `output: 'export'` (+ `trailingSlash: true`), there is **no server runtime**: no API routes, no SSR/middleware, no dynamic route handlers, no on-demand revalidation. Anything browser-specific (`new Date()`, `localStorage`, etc.) must be guarded for hydration — see `components/current-year.tsx` for the pattern. `next/image` will not get an optimizing server in the export, so prefer plain images or set `unoptimized`.

## Adding a post

Drop a `.mdx` file in `content/posts/` with `title` + `date` frontmatter. It appears on the home list and at `/posts/<filename>` automatically — no index to update.

## Known issue

Client-side navigation to the home route `/` via Next `<Link>` has been observed to white-screen in the static export (`a[e] is not a function`). If you hit this, use a plain `<a href="/">` (full reload) for links pointing at home.
