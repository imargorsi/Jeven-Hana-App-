# Jevan Hana App

Community app for residents of **Jevan Hana, Garden Town, Lahore** — local discovery, community updates, events, and town essentials in one place.

## Stack

- Expo 57 + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- Clerk (`@clerk/expo`) — authentication
- TanStack Query — server state (events, community, businesses, uploads live; some domains still mock)
- Zustand + AsyncStorage — client persistence (onboarding, saved items, recent searches)

## Product scope (v1 / v2)

Full tables live in the **central** workspace docs (not inside this app):

- `../AGENTS.md` — planning overview
- `../doc/modules/scope.md` — capability map
- `AGENTS.md` (this repo) — mobile stack / UI rules only

Summary:

### Roles

- **User** — create businesses, places (seeded categories), community posts, events, reviews; edit/delete **own** content only.
- **Admin** (you only) — same as user + edit/delete any content, toggle Featured. Same app, elevated controls. No separate dashboard in v1.
- **No approval queues in v1** — content goes live; admin cleans up.
- **Comments = v2.** Delete users = Clerk Dashboard only for now (no in-app module).

### v1 — anyone (guest OK)

Onboarding → **Home**. Browse Home, Explore, Search, Community, Events. Open business / place detail (Featured = **badge**). Call, WhatsApp, directions, share.

### v1 — signed-in

Like · Going · Save · Reviews · **Create posts / businesses / places (seeded cats) / events** · Edit/delete own · Notifications · Profile · Log out.

Guests who try account actions go to **Create account**.

### v1 — not allowed

Comments · Approval workflows · Separate admin web dashboard · In-app delete user · Settings screen · Stories / chat / followers · Separate Featured module · User self-toggling Featured.

### v2 — planned

**Comments** · Optional approval/claim if spam · push prefs · light admin dashboard / in-app delete-user if needed · remaining domain APIs (auth/users already live).

## Current status (frontend MVP)

UI + live API for core domains when the Express API is running.

| Area | Routes / notes |
| ---- | -------------- |
| Onboarding | → Home (guest); no forced login |
| Auth | Login / register; `/me` sync when API is up |
| Tabs | Public browse (Home, Explore, Community, Events, Profile) |
| Home | Hero, Quick Access, Nearby, Community list (5) |
| Explore / Search | **Public** discovery (businesses live; places folded in) |
| Businesses | Live CRUD + cover upload (R2) + **reviews**; Featured admin toggle |
| Places | Folded into Business; browse → Explore |
| Featured | **Badge only** — admin toggle (`isFeatured`) |
| Community | Live feed + create/edit/delete; like; **comments = v2** |
| Events | Live list + create/edit/delete + Going |
| Notifications | Account (mock) |
| Saved / Profile | Account (local saved; guest Profile = Sign up / Log in) |

**Next:** favorites sync, search server-side, notifications live. See `../AGENTS.md` build order.

## Distribution (v1)

| Phase | Channel | Notes |
| ----- | ------- | ----- |
| **1 — Now** | **Firebase App Distribution** | Controlled testers (friends / close community); WhatsApp & Facebook OK if keep group small |
| **2** | Google Play **Closed Testing** | Better for real town users ($25 Play Console) — normal install, auto-updates |
| **3** | Play **Production** | Open launch |

Firebase works short-term but is **not** ideal for months of whole-town public use (unknown-app warnings, manual updates, trust). Details: `../doc/modules/distribution.md`.

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

Open with Expo Go. Email/password and browser-based Google sign-in work without a custom dev build.

## Project layout

```text
app/                 # Expo Router screens (tabs, stacks, auth)
assets/              # Images, fonts
components/          # Shared cards + UI primitives
constants/           # palette, Colors, Fonts, tokens
features/            # auth, community, events, explore, home, search, …
lib/                 # api.client, services, image.utils, content/, utils
stores/              # Zustand (app, saved, search)
types/               # Shared TypeScript entities
```

Product docs: **`../doc/modules/`** (workspace root). Stack rules: **`AGENTS.md`**.

## Language

- **English** for API, database, form inputs, and search queries.
- **Urdu** only for explanatory UI (headings, About, onboarding, placeholders).
- Search: Urdu placeholder OK; typed query is English LTR.

## Data layer

- Typed entities in `types/`
- Service functions in `lib/services/` (live REST API)
- TanStack Query in screens/hooks — do not put server lists in Zustand
- Zustand only for: `hasOnboarded`, saved IDs, recent searches

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm start` | Start Expo |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier |

## Backend

Core domains talk to the Express API (`EXPO_PUBLIC_API_URL` or Metro host `:3001` in `__DEV__`). Remaining: favorites sync, search server-side, push notifications, reviews part 2.
