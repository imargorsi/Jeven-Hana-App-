# Jevan Hana App

Community app for residents of **Jevan Hana, Garden Town, Lahore** — local discovery, community updates, events, and town essentials in one place.

## Stack

- Expo 57 + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (Tailwind for RN)
- Clerk (`@clerk/expo`) — authentication
- TanStack Query — server-state patterns (currently backed by mocks)
- Zustand + AsyncStorage — client persistence (onboarding, saved items, recent searches)

## Product scope (v1 / v2)

Full tables live in the **central** workspace docs (not inside this app):

- `../AGENTS.md` — planning overview
- `../doc/modules/scope.md` — capability map
- `AGENTS.md` (this repo) — mobile stack / UI rules only

Summary:

### Roles

- **User** — create businesses, places (seeded categories), community posts, events, reviews; edit/delete **own** content only.
- **Admin** (you only) — same as user + delete any content, toggle Featured. Same app, elevated controls. No separate dashboard in v1.
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

UI implemented; **most domains still mock**. Auth/user sync to the Express API is live when the API is running.

| Area | Routes / notes |
| ---- | -------------- |
| Onboarding | → Home (guest); no forced login |
| Auth | Login / register when an account action is required |
| Tabs | Public browse (Home, Explore, Community, Events, Profile) |
| Home | Hero, Quick Access, Nearby, Community list (5) |
| Explore / Search | **Public** discovery |
| Businesses | Detail; review + save need account; **add listing = product intent (UI TBD)** |
| Places | Detail; save needs account; browse → Explore; **add place (seeded cats) = product intent (UI TBD)** |
| Featured | **Badge only** — **admin-only** toggle (`isFeatured`) |
| Community | Public feed; like needs account; **create = product intent (UI TBD)**; **comments = v2** |
| Events | Public list; Going needs account; **create = product intent (UI TBD)** |
| Notifications | Account |
| Saved / Profile | Account (guest Profile = Sign up / Log in) |

**Next:** replace remaining `lib/services/*` mocks with real REST APIs; create/moderation UI per `../doc/modules/scope.md`.

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
```

Product docs: **`../doc/modules/`** (workspace root). Stack rules: **`AGENTS.md`**.

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
