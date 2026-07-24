# Jevan Hana — Mobile App Agents

Expert **React Native / Expo** engineer for `project-jeven-hana/`.

**Product scope & planning:** `../AGENTS.md` and `../doc/modules/` (especially `scope.md`).  
Do not redefine v1/v2 product rules here — follow the root docs.

---

## Stack

- Expo + React Native + TypeScript (strict, no `any`)
- Expo Router
- NativeWind (Tailwind for RN)
- Clerk (`@clerk/expo`) — auth / session / profile name + photo
- TanStack Query — server state (domain modules still mock-backed)
- Zustand + AsyncStorage — onboarding, saved IDs, recent searches
- Axios — `lib/api.client.ts` (auth/user hit live API when configured)
- ESLint 9 (flat) + Prettier

Ask before installing new major libraries.

---

## Layout

```text
app/                 # Expo Router screens (keep thin)
components/          # Shared cards + ui/
constants/           # palette, Colors, Fonts
data/mocks/          # Mock entities until API domains ship
features/            # auth, community, events, explore, home, search, onboarding
lib/                 # api.client, services, queryClient, utils
stores/              # Zustand
types/
```

Path alias: `@/*` → project root.

---

## Auth (mobile)

- Clerk only — no custom auth
- Guests browse Home / Explore / Search / Community / Events
- Gate account actions with `useRequireAuth()` → `/register`
- `AuthSessionSync` → `GET /api/v1/auth/me` when signed in (Neon Users sync)
- Profile edit: Clerk `user.update` + `setProfileImage` (base64 data URL — see `features/auth/clerkProfileImage.utils.ts`)
- Publishable key only (`EXPO_PUBLIC_*` / `NEXT_PUBLIC_*` via `app.config.js`)
- **Never** store `CLERK_SECRET_KEY` in this app
- API base: `EXPO_PUBLIC_API_URL` or Metro host `:3000` in `__DEV__`

---

## Expo Router

- `app/_layout.tsx` — ClerkProvider + QueryClientProvider + `AuthSessionSync` + `global.css`
- `app/(tabs)/` — Home, Explore, Community, Events, Profile (public browse)
- `app/(auth)/` — login + register
- Stack: businesses, places, profile, search, notifications, saved
- Profile stack: edit / posts / saved / going (circular back; no AppHeader)
- Search: back + field, no page title
- v1 create UIs + admin controls still TBD where noted in root scope

---

## Feature pattern

- `features/{module}/*.hook.ts` — TanStack Query / forms
- `features/{module}/components/` — feature UI
- Shared cards in `components/`
- Server lists in TanStack Query — **not** Zustand
- Zustand: onboarding, saved IDs, recent searches only
- Domain `lib/services/*` stay mock until that API exists; auth uses `lib/services/auth.service.ts`

---

## UI rules

- Match existing style exactly; do not redesign unless asked
- Prefer `components/ui/` — `Text`, `Button`, `Chip`, `Card`, `Screen`
- Keep files under ~250 lines — extract hooks / subcomponents
- Mixed English + Urdu inline; `Text` + `isUrdu` for Urdu — no i18n framework
- Do not use raw React Native `Text` for app copy

### Typography / buttons

- `Text` variants: `display`, `h1`–`h3`, `body`, `caption`, `label`, `button`
- `Button` variants: `primary`, `secondary`, `ghost`, `success` — sizes `sm` | `md` | `lg`

---

## Styling (NativeWind)

- Hex source of truth: `constants/palette.js`
- Fonts: `fonts.*` from `constants/Fonts.ts` (Noto Sans + Noto Naskh Arabic)
- Muted in JS: `withAlpha(palette.cream, alpha)` — never hand-written `rgba(...)`
- **Never** hardcode hex/rgb/named colors in UI
- For icons / StatusBar / ActivityIndicator: `palette.*` or `Colors.dark.*`
- Missing color → add to `palette.js` first

| Token | Hex | Examples |
| ----- | --- | -------- |
| Background | `#0D1B3D` | `bg-background` |
| Surface | `#13234F` | `bg-surface` |
| Primary | `#DBAA4D` | `bg-primary`, `text-primary` |
| Primary soft | `#E8C36A` | `bg-primary-soft` |
| Primary deep | `#B8892E` | `text-primary-deep` |
| Cream | `#F8F6F2` | `text-cream` |
| Success | `#16A344` | `text-success` |
| Error | `#DC2626` | `text-error` |
| Muted | `#94A3B8` | `text-muted` |

Use `primarySoft` / `primaryDeep` only for premium accents. Muted borders/text: opacity on tokens (`text-cream/60`).

---

## Naming

| Thing | Convention | Example |
| ----- | ---------- | ------- |
| Components / Screens | PascalCase | `BusinessCard.tsx` |
| Functions | camelCase | `getBusinessById` |
| Interfaces | `I` prefix | `IBusiness` |
| Types | `T` prefix | `TUserProfile` |
| Booleans | `is` / `has` | `isKaBest` |
| Hooks | `.hook.ts` | `useRequireAuth.hook.ts` |
| Utils | `.utils.ts` | `storage.utils.ts` |
| Stores | `use{Name}Store` | `useSavedItemsStore.ts` |

---

## DO / DON'T

**DO:** NativeWind `className`; Clerk for auth; Zustand for client prefs; simple readable code.  
**DON'T:** Mix UI and business logic; hardcode colors; custom auth; Redux; invent product scope that contradicts `../doc/modules/scope.md`.

---

## Lint / format

```bash
npm run lint:fix
npm run format
```

Prettier owns formatting; ESLint owns quality + import order.

---

## When building

1. Read `../AGENTS.md` + `../doc/modules/{feature}.md`
2. Follow **this** file for mobile patterns
3. One module at a time; wire to live API only when that route exists
4. Fix lint/type errors before finishing
