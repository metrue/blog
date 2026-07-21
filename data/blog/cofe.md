---
title: The Complete cici Guide
date: 2025-10-06T10:30:00.000Z
status: draft
latitude: 37.78297388090404
longitude: -122.41031261300729
city: San Francisco
street: Market Street
---

[**cici**](https://github.com/metrue/cici) is a beautifully simple, git-backed blog & memo app. Your posts and memos live as Markdown and JSON in **your own Git repo** — no database, everything under version control. You install cici from npm and point it at that content.

> **Live example:** this very blog, [blog.minghe.me](https://blog.minghe.me), runs on cici.

> **cici is pure tooling.** Your *content* lives in your repo or folder; cici is the app that serves and edits it. You never fork the cici repo.

## How it works

cici has one content contract and two backends behind it:

- **Local files** — point at a folder on disk (`--dir`).
- **A GitHub repo** — point at `owner/name` (`--repo`), read-only or, with a token, read-write.

Content lives under a **`data/`** folder:

```
data/
  blog/            # one <slug>.md per post (front-matter + Markdown)
  memos.json       # short-form memos
  site-config.json # title, author, social links
  highlights/      # one <slug>.json per post (optional)
  likes.json       # like counts (optional)
  assets/          # images uploaded from the editor
```

## Run it locally

No clone, no build — just `npx`:

```bash
# Serve AND edit local content. --dir points at the folder holding blog/ (i.e. data/):
npx cici --dir ./data

# Serve a GitHub content repo (reads its data/ automatically, read-only):
npx cici --repo owner/name

# ...with a token, edit it too — /editor commits straight back to the repo:
npx cici --repo owner/name --token ghp_xxx --port 4000
```

Open `http://localhost:3000`, and `/editor` to write. In `--dir` mode changes save to disk; with a token they're committed to your repo.

## Deploy on Vercel

The thing you deploy is your **content repo** — it just depends on cici. No app source, no fork.

**1.** Add a `package.json` at the repo root (next to `data/`):

```json
{
  "private": true,
  "scripts": { "build": "cici build" },
  "dependencies": { "cici": "^0.4.3" }
}
```

**2.** Add `vercel.json` so Vercel serves cici's output instead of running its own Next build:

```json
{ "framework": null, "buildCommand": "cici build" }
```

`cici build` emits [Vercel's Build Output API](https://vercel.com/docs/build-output-api) — cici's prebuilt server as a single function plus static assets — which Vercel serves directly.

**3.** Set environment variables on the Vercel project:

| Variable | Value |
|---|---|
| `CICI_REPO` | `owner/name` of your content repo |
| `GITHUB_ID` / `GITHUB_SECRET` | a GitHub OAuth app for `/editor` sign-in (callback `<site>/api/auth/callback/github`) |
| `NEXTAUTH_SECRET` | any random string (signs the session) |
| `NEXTAUTH_URL` | your site URL, e.g. `https://blog.example.com` |
| `CICI_TOKEN` | **optional — private repos only.** A GitHub token with **Contents: read & write**. |

If your content repo is **public**, you don't need a token at all: cici reads it anonymously, and `/editor` commits with your own GitHub sign-in — so reads work for everyone and only you (whoever can push to the repo) can publish. Add `CICI_TOKEN` only when the repo is private.

Deploy. cici reads your content at request time, so anything you write — via `/editor` or a plain `git push` to the content repo — shows up without a redeploy.

> **Not on Vercel?** Any Node host works (Railway, Render, Fly, a VPS, Docker): skip `cici build` and run `cici start` with the same `CICI_*` env — it boots the server directly.

### GitHub OAuth app

`/editor` sign-in uses GitHub OAuth. Create one at [Settings → Developer settings → OAuth Apps](https://github.com/settings/developers):

- **Homepage URL:** your site (or `http://localhost:3000` for local)
- **Authorization callback URL:** `<site>/api/auth/callback/github`

Save the **Client ID** / **Client Secret** as `GITHUB_ID` / `GITHUB_SECRET`.

## Writing content

### Blog posts

One Markdown file per post under `data/blog/<slug>.md`, with front-matter:

```yaml
---
title: Your Post Title
date: 2026-07-21T10:30:00.000Z
status: published        # or "draft"
city: San Francisco      # optional location
street: Market Street
external_discussions:    # optional — link HN / Reddit / V2EX threads
  - platform: hackernews
    url: https://news.ycombinator.com/item?id=123456
---

Your Markdown here — code highlighting, LaTeX math, images, all supported.
```

### Memos

Short-form entries in `data/memos.json`:

```json
{
  "id": "1728123456789",
  "content": "A quick thought with **Markdown**",
  "timestamp": "2026-07-21T10:30:00.000Z",
  "city": "San Francisco"
}
```

### Site config

Your title, author, and social links live in `data/site-config.json`:

```json
{
  "title": "Your Blog",
  "description": "Thoughts and notes",
  "author": { "name": "Your Name", "bio": "…", "location": "Earth" },
  "social": { "github": "yourname", "twitter": "yourname" },
  "keywords": ["blog", "notes"]
}
```

## Features

- **Rich posts** — Markdown, syntax highlighting (100+ languages), KaTeX math, drag-and-drop images
- **Quick memos** — instant capture with optional location, likes, masonry layout
- **External discussions** — auto-fetch comment links from Hacker News, Reddit, V2EX
- **Your data, versioned** — everything is Markdown/JSON in your Git repo
- **Mobile-first, fast** — static where possible, dynamic where it counts

## GraphQL API

cici exposes a GraphQL endpoint at `/api/graphql`:

```graphql
query { blogPosts { id title date } }
query { blogPost(id: "slug") { title content discussions { platform url count } } }
query { memos { id content timestamp } }
```

Writes (create post / create memo / toggle like) are available when authenticated.

## Analytics (optional)

Privacy-first analytics via [Umami](https://umami.is):

```bash
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
# optional self-host / domain scoping:
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami.com/script.js
NEXT_PUBLIC_UMAMI_DOMAINS=yourdomain.com
```

## Troubleshooting

- **Blog is empty on deploy** — check `CICI_REPO` points at your content repo. If the repo is **private**, also confirm `CICI_TOKEN` has **Contents: read & write** on it (a `401` means the token string is wrong/expired; a `404` means the repo isn't in the token's scope). A **public** repo needs no token.
- **`/editor` sign-in fails** — verify the OAuth callback URL, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` match your domain.
- **Images not loading** — cici uses Vercel Image Optimization on deploy; for other hosts, `cici start` serves images through the app.

## Migrating in

Coming from Jekyll / Hugo / Ghost / WordPress? Export posts to Markdown, drop them in `data/blog/`, set the front-matter (`title`, `date`, `status`), move images into `data/assets/`, and point cici at the folder.

---

That's cici: your words, in your repo, served anywhere. Questions or ideas? Open an issue on [GitHub](https://github.com/metrue/cici/issues). Happy writing. ☕
