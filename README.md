# blog.minghe.me — content

Public content repository for **blog.minghe.me**, served by [cici](https://github.com/metrue/cici).

This repo holds *only* content. The blog application (Next.js app, runtime, CLI)
lives in the public `metrue/cici` package and is consumed as a dependency.

## Layout

Content lives under `data/` (cici's content root):

```
data/
  blog/            one <slug>.md per post (front-matter + markdown)
  memos.json       memos
  site-config.json site settings
  likes.json       like counts
  highlights/      one <slug>.json per post
  assets/          images referenced by posts
  blog-manifest.json  derived index of posts
```

## Local editing

Serve + edit this content locally with the cici CLI (points at the `data/` root):

```bash
npx cici --dir data
# open http://localhost:3000  (and /editor to write)
```

## Deploy (Vercel)

Vercel builds this repo with cici's build command and serves the app, reading
content from this repo at request time over the GitHub API.

- **Build command:** `cici build`
- **Env:**
  - `CICI_REPO=metrue/blog` — content source (this repo; public → no token needed to read)
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://blog.minghe.me`
  - `GITHUB_ID`, `GITHUB_SECRET` — GitHub OAuth; only the repo owner (from `CICI_REPO`) can edit
  - `GITHUB_USERNAME` — optional; the owner is otherwise taken from `CICI_REPO`
  - **Do not** set `CICI_TOKEN` here — a shared server token would let any visitor write; cici ≥ 0.6.0 ignores it in hosted OAuth mode. It's only for the localhost CLI (`npx cici --repo … --token …`).

> Requires cici ≥ 0.6.0 (owner-gated OAuth writes; `CICI_TOKEN` ignored on hosted deploys).

See `.env.example`.

<!-- deploy-trigger: verifying content-repo build on Vercel -->