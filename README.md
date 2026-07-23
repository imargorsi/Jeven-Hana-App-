# Jevan Hana App

Community app for residents of **Jevan Hana, Garden Town, Lahore** — local discovery, community updates, events, and town essentials in one place.

## Stack

- Expo 57 + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- Clerk (`@clerk/expo`) — authentication
- TanStack Query — server-state patterns (currently backed by mocks)
- Zustand + AsyncStorage — client persistence (onboarding, saved items, recent searches)

## Current status (frontend MVP)

Implemented with **mock data** (no backend yet):

| Area | Routes / notes |
| ---- | -------------- |
| Onboarding | `app/onboarding.tsx` |
| Auth | Login, register, email verification, Google/Facebook SSO |
| Tabs | Home, Explore, Community, Events, Profile |
| Home | Hero, Quick Access, Nearby Highlights, Community list (5) |
| Explore | Business category filters + compact listings |
| Businesses | Detail (call / WhatsApp / directions, reviews); index → Explore |
| Places | Detail; listing/category routes redirect → Explore for v1 |
| Jevan Hana Ka Best | Curated recommendations |
| Community | Feed with like + share; **no post detail**; admin posts for v1 |
| Events | Sectioned list (Today → This Month) + Going; **no detail page** |
| Search | Back + field; recent/trending chips; soft filters; shared cards |
| Notifications | Grouped list, mark read; post → Community, event → Events tab |
| Saved | Flat list under Profile (`/profile/saved`); `/saved` redirects |
| Profile | Edit, my posts, saved places, events going, logout (no settings) |

**Not in scope:** stories, reels, chat, followers, reshares, feed ranking, event detail (v1), i18n translation files (mixed English/Urdu strings inline via `Text` `isUrdu`).

**Next:** replace `lib/services/*` mocks with real REST APIs.

## Getting started

```bash
npm install
cp .env.example .env
```

Add your Clerk publishable key to `.env` or `.env.local`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Clerk CLI may write `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` instead — both are supported via `app.config.js` → `extra.clerkPublishableKey`.

Use only the **publishable** key (`pk_...`). Never put `CLERK_SECRET_KEY` in this Expo app.

Enable the Native API in the [Clerk Dashboard](https://dashboard.clerk.com/~/native-applications), then:

```bash
npm start
# or
npx expo start --clear
```

Open with Expo Go. Email/password and browser-based Facebook or Google sign-in work without a custom dev build.

## Project layout

```text
app/                 # Expo Router screens (tabs, stacks, auth)
assets/              # Images, fonts
components/          # Shared cards + UI primitives
constants/           # palette, Colors, Fonts, tokens
data/mocks/          # Mock entities (replace with API later)
features/            # auth, community, events, explore, home, search, …
lib/                 # queryClient, services, utils
stores/              # Zustand (app, saved, search)
types/               # Shared TypeScript entities
doc/modules/         # Local product notes (gitignored)
```

## Data layer

- Typed entities in `types/`
- Mock data in `data/mocks/`
- Service functions in `lib/services/` (async, REST-shaped; easy to swap for real APIs)
- TanStack Query in screens/hooks — do not put server lists in Zustand
- Zustand only for: `hasOnboarded`, saved IDs, recent searches

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm start` | Start Expo |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier |

## Backend (later)

Replace mock services with real REST endpoints, wire `lib/api.client.ts` to `EXPO_PUBLIC_API_URL`, add image upload, saved-items sync, push notifications, and event RSVP persistence.
