# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This directory wears **two hats**:

1. **GitHub profile repo** (`vanishcode/vanishcode`). The *only* git-tracked file is
   `README.md` — the personal profile shown at https://github.com/vanishcode. Keep it
   short and prose-only.
2. **Deployed static export of the personal blog** (https://vanishcode.com). Everything
   else here — `index.html`, `index.txt`, `posts/`, `about/`, `_next/`,
   `404*`, `api/` — is the **pre-built output of a Next.js 14 App Router site**
   (`output: 'export'`, `trailingSlash: true`). These files are **untracked**.

> The blog's MDX source project was deleted and is **not present**. There is no
> dev/build/lint/test toolchain in this repo — you are editing build artifacts directly.
> Treat the HTML/RSC as the source of truth.

## Previewing locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000/
# /posts/<slug>/ resolves to posts/<slug>/index.html
```

## How the export is structured (the non-obvious part)

This is a **React Server Components (RSC / Flight) static export**, so every page exists
in two forms and the post list is duplicated in several places that must stay in sync.

- **Each route → `<route>/index.html`** (full HTML) **+ `<route>/index.txt`** (the raw RSC
  Flight payload the client router fetches on navigation). Every `index.html` *also*
  embeds that same payload inside `<script>self.__next_f.push([1,"…"])</script>` chunks
  (with quotes backslash-escaped).
- **Each blog post = up to 4 files**: `posts/<slug>/index.html` + `posts/<slug>/index.txt`
  (the live page), and a flat `posts/<slug>.html` + `posts/<slug>.txt` left over from an
  older build (see dual-design note). When editing a post, update **all** the files that
  exist for it.
- **Two coexisting designs.** The live site (homepage + `posts/<slug>/index.html`) uses the
  **new** design: `font-mono bg-bg text-ink`, `.card`, brand header + footer, CSS
  `_next/static/css/d91b1410ba4ea42d.css`. The stale flat `*.html` files use the **old**
  design (`max-w-2xl` prose, CSS `ab7e9e5ae5ed4b12.css`). **Author new content in the new
  design** — clone an existing new-design post and swap text, don't copy the flat files.
- **Theming**: design tokens are CSS variables (light in `:root`, dark in `.dark`) inside
  the `_next` CSS; Tailwind maps `bg-bg→--bg`, `text-ink→--text`, `text-muted`,
  `text-accent`, `border-line→--border`, plus `.card`. Dark mode is the `.dark` class
  (next-themes). Code blocks are Shiki dual-theme (`github-light`/`github-dark`,
  `data-rehype-pretty-code-figure`, `--shiki-light/-dark`).

## Editing the home post list — keep 3 locations in sync

The list of posts appears in **three** places. If they disagree, the post renders on first
paint but **disappears after hydration** (React reconciles against the RSC tree):

1. Visible `<ul class="m-0 p-0 list-none">` in `index.html` — `href="/posts/<slug>/"`
   (trailing slash). Last `<li>` is `py-5` (no border); others `py-5 border-b border-line`.
2. Embedded RSC inside `index.html` — escaped quotes, Link component is `$L8`,
   `href":"/posts/<slug>"` (no trailing slash), `<li>` key `"posts/<slug>.mdx"`.
3. `index.txt` — raw quotes, Link component is `$L6`, `href":"/posts/<slug>"`.

Posts are ordered **newest date first**. Dates render as `MMM D, YYYY` (e.g. `Jul 10, 2025`).

### Adding a post

1. Clone `posts/<existing>/` → `posts/<slug>/`; swap title, date, slug tokens
   (`["slug","<slug>","c"]`, `__PAGE__?{"slug":["<slug>"]}`, canonicalUrl), and body in
   `index.html` + `index.txt`. Optionally also create the flat `posts/<slug>.html/.txt`.
2. Insert the `<li>` into all 3 list locations above (at the top if it's the newest).

### Removing a post

Delete its files and remove its `<li>` from all 3 list locations.

## Always validate RSC after editing

A malformed payload breaks hydration silently. After any edit, confirm every RSC line
parses as JSON — for each `N:` line in a `.txt` file and each reconstructed line from the
concatenated `__next_f.push` chunks in an `.html` file, JSON-parse the part after `N:`
(skip lines starting with `I{` or `HL[`, and the bare `"$L3"`). The home list lives in the
`3:` payload (index.txt) / the `3:` embedded chunk (index.html).
