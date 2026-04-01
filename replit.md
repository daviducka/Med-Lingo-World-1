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
- **Fonts**: Nunito + Fredoka One (Google Fonts)

## Project: El_lingo

El_lingo is a Duolingo-style medical learning platform for medical students with full Albanian language support as the primary language.

### Features
- Gamified medical lessons (30 questions each) — anatomy, pharmacology, physiology, pathology, microbiology, biochemistry, neuroanatomy, immunology, biology, ecology, genetics, botany
- XP, streaks, hearts (lives), leaderboard
- Hard Round mode — board-exam-level questions (USMLE style), double XP
- **Flashcards** — Gizmo.ai-style flip cards, track known/unknown, organized by course
- **Study Notes** — Key points, mnemonics, clinical pearls per lesson
- **Exam Prep** — 30 USMLE-style questions by subject with explanations
- **Albanian (Shqip) as first-class language** — all content available in Albanian
- Multi-language support (15 languages)
- AdSense placeholder in footer for monetization
- Progress tracking with charts

### UI/Design
- Color scheme: purple primary (`hsl(258 90% 60%)`)
- Fonts: Nunito (body), Fredoka One (headings)
- Duolingo-style gamification: XP, streaks (flame), hearts (❤️), leaderboard
- Mobile bottom nav + desktop sidebar layout
- Shimmer text effect on headings

### Seed Data (run: `pnpm --filter @workspace/db run seed`)
- **24 courses**: 12 Albanian (sq) + 12 English (en)
- **30 lessons** across anatomy, ecology, biology, pharmacology, physiology courses
- **120 questions**: 30 per lesson in both languages (skeletal anatomy, ecology, cell biology)
- **40 flashcards**: for anatomy courses in both languages
- **4 study notes**: with key points, mnemonics, clinical pearls

### Artifacts
- `artifacts/ellingo` — React/Vite frontend (port from env PORT, path: `/`)
- `artifacts/api-server` — Express API (port 8080, path: `/api`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── ellingo/            # El_lingo React frontend
│       └── src/
│           ├── pages/
│           │   ├── Home.tsx          # Dashboard with Albanian UI
│           │   ├── Learn.tsx         # Course grid with language filter
│           │   ├── Flashcards.tsx    # Gizmo-style flip cards
│           │   ├── StudyNotes.tsx    # Notes with key points/mnemonics/pearls
│           │   ├── ExamPrep.tsx      # USMLE-style 30-question exam
│           │   ├── HardRound.tsx     # Board-exam challenge mode
│           │   ├── Lesson.tsx        # Immersive quiz player
│           │   └── ...
│           ├── hooks/
│           │   └── useUserLanguage.ts  # Returns user's selected language
│           └── components/
│               └── layout/Layout.tsx   # Sidebar + mobile nav (Albanian labels)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/
│           ├── schema/
│           │   ├── users.ts
│           │   ├── courses.ts
│           │   ├── lessons.ts
│           │   ├── questions.ts
│           │   ├── flashcards.ts        # NEW
│           │   ├── study_notes.ts       # NEW
│           │   ├── user_progress.ts
│           │   └── hard_round_results.ts
│           └── seed.ts        # 24 courses, 120 questions, 40 flashcards, 4 notes
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
- `/` — Home/Dashboard (Albanian: stats, Albanian courses, daily challenge, quick links)
- `/learn` — Course grid with 🇦🇱 Albanian language selector
- `/learn/:courseId` — Course detail with lesson path
- `/lesson/:lessonId` — Duolingo-style immersive quiz (30 questions)
- `/flashcards` — Gizmo.ai-style flip cards (choose course → study)
- `/study-notes` — Key points, mnemonics, clinical pearls per lesson
- `/exam-prep` — 30 USMLE questions, by subject, with explanations
- `/hard-round` — Board-level challenge mode (double XP)
- `/leaderboard` — Weekly XP rankings
- `/progress` — Progress charts
- `/profile` — User profile and language settings

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API. Routes:
- `GET/PATCH /api/users/profile` — User profile (includes selectedLanguage)
- `GET /api/users/stats` — XP, streak, hearts, rank
- `GET /api/courses?language=sq` — List courses filtered by language
- `GET /api/courses/:id` — Course with lessons
- `GET /api/courses/:id/lessons` — Lessons with status
- `GET /api/lessons/:id` — Lesson with questions
- `POST /api/lessons/:id/complete` — Complete lesson, award XP
- `GET /api/flashcards?courseId=` — List flashcards by course
- `POST /api/flashcards/:id/flip` — Record flashcard flip (known/unknown)
- `GET /api/study-notes/:lessonId` — Study notes for a lesson
- `GET /api/exam-prep/questions?subject=&count=30` — USMLE exam questions
- `POST /api/exam-prep/submit` — Submit exam, get score + XP
- `GET /api/hard-round/questions` — Board-level questions
- `POST /api/hard-round/submit` — Submit hard round answers
- `GET /api/progress` — User course progress
- `GET /api/progress/summary` — Aggregated summary
- `GET /api/leaderboard` — Weekly XP leaderboard
- `GET /api/languages` — 15 supported languages

### `lib/db` (`@workspace/db`)

Database tables: users, courses, lessons, questions, flashcards, study_notes, user_progress, hard_round_results.

- `pnpm --filter @workspace/db run push` — sync schema
- `pnpm --filter @workspace/db run seed` — seed all Albanian+English content

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec at `openapi.yaml`. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Language Architecture

- User has `selectedLanguage` (default: `sq` for Albanian)
- All course/lesson queries pass `?language=` to filter by language
- React pages use `useGetUserProfile()` → `profile.selectedLanguage` to get the active language
- When user changes language in Learn page, it also calls `useUpdateUserProfile()` to persist
- `useUserLanguage()` hook at `artifacts/ellingo/src/hooks/useUserLanguage.ts` — shortcut for getting user language

## Monetization

AdSense placeholder div with id="ad-container" is present in the Layout footer. To activate AdSense:
1. Sign up at https://adsense.google.com
2. Get your publisher ID
3. Replace the placeholder div with the AdSense script tag

## Default User

The API uses a single default user (id=1, username="medstudent", language="sq" Albanian) for demo purposes. In production, implement proper authentication.
