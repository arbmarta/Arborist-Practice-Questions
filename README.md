# Arborist Study — Next.js

A static-export Next.js + TypeScript rebuild of the arboriculture learning site.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
```

The static site is written to `out/` and requires no server runtime.

## GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys the site whenever `main` is pushed. In the repository settings, set **Pages > Source** to **GitHub Actions**.

This configuration assumes the site is served at the root of its Pages hostname (for example a `username.github.io` repository or a custom domain). If this is a project Pages repository served at `/repository-name/`, set `basePath` in `next.config.ts` before deploying.

## Architecture

- `src/app/` — routes and application shell
- `src/components/Quiz.tsx` — shared interactive quiz engine
- `src/components/Progress.tsx` — local lesson completion tracking
- `src/lib/content.ts` — migrated lesson HTML and question banks
- `src/lib/navigation.ts` — domain navigation
- `public/` — images and static assets

Progress and quiz best scores are stored only in the visitor's browser using `localStorage`. No database or account is required.
