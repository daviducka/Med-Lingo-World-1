# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS (shadcn/ui)
- **Routing**: Wouter
- **Charts**: Recharts

## Project: El_lingo

El_lingo is a Duolingo-style medical learning platform for medical students. Available in 15+ languages.

### Features
- Gamified medical lessons (anatomy, pharmacology, physiology, pathology, microbiology, biochemistry, neuroanatomy, immunology)
- XP, streaks, hearts (lives), leaderboard
- Hard Round mode — board-exam-level questions (USMLE style)
- Multi-language support (15 languages)
- AdSense placeholder in footer for monetization
- Progress tracking with charts

### Artifacts
- `artifacts/ellingo` — React/Vite frontend (port from env PORT, path: `/`)
- `artifacts/api-server` — Express API (port 8080, path: `/api`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── ellingo/            # El_lingo React frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── users.ts
│           ├── courses.ts
│           ├── lessons.ts
│           ├── questions.ts
│           ├── user_progress.ts
│           └── hard_round_results.ts
├── scripts/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/ellingo` (`@workspace/ellingo`)

React+Vite frontend. Pages:
- `/` — Home/Dashboard (stats, course cards, Hard Round CTA)
- `/learn` — Course selection grid with language filter
- `/learn/:courseId` — Course detail with lesson path
- `/lesson/:lessonId` — Duolingo-style immersive quiz
- `/hard-round` — Board-level challenge mode
- `/leaderboard` — Weekly XP rankings
- `/progress` — Progress charts
- `/profile` — User profile and settings

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API. Routes:
- `GET/PATCH /api/users/profile` — User profile
- `GET /api/users/stats` — XP, streak, hearts, rank
- `GET /api/courses` — List all courses
- `GET /api/courses/:id` — Course with lessons
- `GET /api/courses/:id/lessons` — Lessons with status
- `GET /api/lessons/:id` — Lesson with questions
- `POST /api/lessons/:id/complete` — Complete lesson, award XP
- `GET /api/hard-round/questions` — Board-level questions
- `POST /api/hard-round/submit` — Submit hard round answers
- `GET /api/progress` — User course progress
- `GET /api/progress/summary` — Aggregated summary
- `GET /api/leaderboard` — Weekly XP leaderboard
- `GET /api/languages` — 15 supported languages

### `lib/db` (`@workspace/db`)

Database schema tables: users, courses, lessons, questions, user_progress, hard_round_results.

- `pnpm --filter @workspace/db run push` — sync schema
- `pnpm --filter @workspace/db run push-force` — force sync

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec at `openapi.yaml`. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Monetization

AdSense placeholder div with id="ad-container" is present in the Layout footer. To activate AdSense:
1. Sign up at https://adsense.google.com
2. Get your publisher ID
3. Replace the placeholder div with the AdSense script tag

## Default User

The API uses a single default user (id=1, username="medstudent") for demo purposes. In production, implement proper authentication.
