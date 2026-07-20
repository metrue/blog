# blog.minghe.me — content

Private content repository for **blog.minghe.me**, served by [cici](https://github.com/metrue/cici).

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
  - `CICI_REPO=metrue/blog` — content source (this repo)
  - `CICI_TOKEN=…` — token with read+write on this private repo (server-side reads + `/editor` writes)
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://blog.minghe.me`
  - `GITHUB_ID`, `GITHUB_SECRET` — GitHub OAuth for `/editor` sign-in

> Requires cici ≥ 0.2.0 (adds the `cici build` command). Until that release,
> `npm install` / `cici build` here will not resolve.

See `.env.example`.
