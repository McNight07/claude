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

## Publishing to the App Store / Play Store

This is an Expo project, so builds go through [EAS Build](https://docs.expo.dev/build/introduction/),
not Flutter's `flutter build appbundle`/`flutter build ipa`.

**Already done in this repo:**
- Unique bundle identifiers (`com.techcareerexplorer.app` for both platforms) and
  version/build numbers in `app.json`
- A real app icon, Android adaptive icon (foreground/background/monochrome),
  and splash screen (`assets/*.png`, wired up via the `expo-splash-screen`
  plugin) instead of Expo's blank template graphics
- `eas.json` with development/preview/production build profiles
- Draft `PRIVACY_POLICY.md` and `TERMS_OF_SERVICE.md` — **read the placeholder
  markers in each file; they need your name/email and a legal read before use**

**Steps that only you can do** (they need your identity, a payment method, and
interactive web consoles I don't have access to):
1. Enroll in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/yr) and create a
   [Google Play Console](https://play.google.com/console/) account ($25 one-time)
2. Host `PRIVACY_POLICY.md` (filled in) at a public URL — both stores require this
3. Run `npx eas-cli build --platform android` / `--platform ios` (after `npx eas-cli login`
   and `eas build:configure`) to produce the `.aab`/`.ipa`
4. Take real screenshots on a device or simulator, write the store listing copy,
   and submit through App Store Connect / Play Console

**Before submitting, note these gaps vs. a typical launch checklist:**
push notifications, an AI career advisor, and payments are not implemented —
don't promise them in store copy. Resume Builder is a labeled "coming soon"
placeholder, not a working feature. Firebase/analytics/crash reporting aren't
wired up (this build's data layer is local-only, per the section above).
