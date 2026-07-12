# Tech Career Explorer

A React Native (Expo) mobile app that helps students, career changers, and IT
professionals discover tech careers, compare career paths, learn required
skills, earn certifications, and build personalized learning roadmaps. Every
screen is functional — real auth, real search/filtering, a real quiz scoring
engine, and persisted per-user progress — backed by a local data layer today
so it runs with zero external setup.

## Getting started

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

## Architecture

- `src/db/localDb.ts` – a tiny Firestore-shaped local database
  (AsyncStorage-backed collections with get/set/update/delete). Swapping this
  for real Firestore calls later shouldn't require touching the screens or
  contexts that consume it, since the method shapes mirror Firestore usage.
- `src/db/seed.ts` – seeds the `careers`, `certifications`, `roadmaps`, and
  `quizQuestions` collections from `src/data/*` on first launch.
- `src/auth/AuthContext.tsx` – email/password auth (SHA-256 hashed via
  `expo-crypto`) plus a demo Google sign-in stand-in, backed by the same local
  database. Real Google/Apple OAuth need a Firebase or Google Cloud project's
  client IDs, which this build doesn't have.
- `src/context/AppDataContext.tsx` – the app's data hub: careers,
  certifications, roadmaps, quiz questions, and every per-user record
  (favorites, bookmarks, certification/roadmap progress, quiz results, study
  log, the in-session compare list).
- `src/quiz/scoring.ts` – cosine-similarity matching between a user's quiz
  answers and each career's trait vector.
- `src/services/hackerNewsService.ts` + `src/context/NewsContext.tsx` – live
  IT/tech industry news from the free, keyless Hacker News API. Fetches on
  launch if the cached copy is more than 15 minutes old, auto-refreshes every
  15 minutes while the app is open, and supports pull-to-refresh; falls back
  to a small offline sample (with a visible "offline" indicator) if the
  network is unavailable.
- `src/navigation` – an auth stack (sign in/up/forgot password) vs. an app
  stack (bottom tabs — Home, Explore, Learn, Progress, Profile — plus pushed
  detail screens for career/certification/roadmap detail, compare, quiz,
  news, and edit profile).
- `src/screens`, `src/components` – screens grouped by feature
  (careers, certifications, roadmaps, quiz, profile, auth), shared UI
  primitives at the top level of `src/components`.

## What's real vs. deferred

Working end-to-end: sign up/in, career search & filters, favorites, career
comparison with PDF export, the career quiz and its results, certification
bookmarking/progress/exam-date tracking, roadmap step completion with
sequential unlocking, the progress dashboard (streak, weekly chart,
achievements), profile editing (incl. photo picker), and a live-updating IT
news feed.

Deferred (need external accounts/services this environment doesn't have):
real Firebase/Firestore, Apple Sign-In, a live jobs board API, an AI career
advisor, push notifications, and the admin dashboard. The Resume Builder
quick action links to a labeled "coming soon" screen rather than a stub that
pretends to work.
