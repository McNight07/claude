# Tech Career Explorer

A React Native (Expo) mobile app that helps students, career changers, and IT
professionals discover tech careers, compare career paths, learn required
skills, earn certifications, and build personalized learning roadmaps.

## Getting started

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

## Project structure

- `App.tsx` – app entry, wraps navigation in the theme provider
- `src/navigation` – bottom tab navigator (Home, Explore, Learn, Progress, Profile)
- `src/screens` – top-level screens, including the fully-built `HomeScreen`
- `src/components/home` – home screen sections (header, quick actions, featured
  careers, continue learning, recommendations, career comparison,
  certifications, learning roadmap, daily goal, tech news)
- `src/components` – shared UI primitives (Card, Pill, ProgressRing, ProgressBar, GradientButton)
- `src/theme` – light/dark color tokens and theme provider
- `src/data` – mock data for careers, certifications, recommendations, and news
