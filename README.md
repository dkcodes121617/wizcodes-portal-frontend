# WizCodes Portal — Frontend

Next.js 16 (App Router, Turbopack, React Compiler) + Tailwind CSS v4 + TypeScript.

- **Deploys to:** Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))
- **Backend:** <https://github.com/dkcodes121617/wizcodes-portal-backend>

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**That is genuinely it.** No `.env` file is required — the app defaults to
`http://localhost:8000`, exactly where the backend's `python main.py` serves.
Start the backend and the two are already talking.

Create `.env.local` only to override that (for example, to develop against the
deployed backend without running Python locally):

```bash
cp .env.example .env.local      # then edit NEXT_PUBLIC_API_URL
```

> `.env.local` is the "real values" file and is gitignored — it will not appear
> in the repo. `.env.example` is the committed template.

---

## Commands

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Development server with hot reload             |
| `npm run build`     | Production build                               |
| `npm run start`     | Serve the production build (run `build` first) |
| `npm run lint`      | ESLint                                         |
| `npm run typecheck` | TypeScript, no emit                            |
| `npm run format`    | Prettier (also sorts Tailwind classes)         |
| `npm run verify`    | lint + typecheck + build — run before pushing  |

---

## Talking to the backend

One variable connects the two apps: **`NEXT_PUBLIC_API_URL`**. You do not have
to set it anywhere — both defaults are already correct.

| Where      | Resolves to                                    | Who sets it |
| ---------- | ---------------------------------------------- | ----------- |
| Local      | `http://localhost:8000`                        | automatic   |
| Production | `https://wizcodes-portal-backend.onrender.com` | automatic   |

Setting the variable always wins — use it to point local dev at the deployed
backend, or after moving to a custom domain. The fallbacks live in
[src/lib/urls.ts](src/lib/urls.ts), which is also what `next.config.ts` reads to
build the CSP, so the API client and the `connect-src` allow-list cannot drift.

A value that is set but malformed still fails the build. That is a typo, not an
omission, and silently ignoring it would be worse.

Never read `process.env.NEXT_PUBLIC_API_URL` directly. Import the client:

```ts
import { api } from "@/lib/api";

const status = await api.get<{ status: string }>("/api/v1/health");
```

`src/lib/env.ts` validates the URL once at startup and `src/lib/api.ts` handles
timeouts, JSON, errors, and bearer tokens. Because everything funnels through
one place, there is nowhere for a hardcoded hostname to hide.

**The one gotcha:** `NEXT_PUBLIC_*` values are baked in at **build** time, not
read at runtime. Change one in Vercel → you must **redeploy**.

---

## The theme

All brand colours live in `src/app/globals.css` inside `@theme`. Tailwind v4 is
CSS-first — there is no `tailwind.config.js`. Every token becomes a utility
automatically:

```html
<div class="bg-canvas text-ink border-border">
  <span class="text-brand">Brand blue</span>
</div>
```

### Tokens

| Utility                               | Purpose                 | Hex                               |
| ------------------------------------- | ----------------------- | --------------------------------- |
| `canvas`                              | Page background         | `#F6F9FB`                         |
| `surface`                             | Cards, white surfaces   | `#FFFFFF`                         |
| `surface-raised`                      | Chips, raised surfaces  | `#EEF3F7`                         |
| `spotlight`                           | Dark spotlight sections | `#000205`                         |
| `spotlight-nested`                    | Nested surfaces on dark | `#0A0D12`                         |
| `baby` / `baby-wash`                  | Baby blue / light wash  | `#8ECAE6` / `#E4F2F9`             |
| `brand` / `brand-strong`              | Main blue / darker blue | `#2E90C4` / `#1E7AAB`             |
| `on-baby`                             | Text on baby blue       | `#0B2138`                         |
| `ink` / `ink-secondary` / `ink-muted` | Text ramp               | `#15233A` / `#545E6B` / `#667080` |
| `ink-on-dark` / `ink-muted-on-dark`   | Text on navy            | `#EAF4FA` / `#8FA0B5`             |
| `border` / `border-strong`            | Borders                 | `#E8EEF2` / `#D4DEE6`             |
| `web` / `mobile` / `ai`               | Category colours        | `#2E90C4` / `#0E9C9C` / `#8B3FD9` |
| `success` / `warning` / `danger`      | Status                  | `#1F9D57` / `#B7791F` / `#D64545` |

Each category and status colour has a matching `-bg` variant, e.g.
`bg-success-bg text-success`.

### Helper classes

| Class                  | Effect                                                   |
| ---------------------- | -------------------------------------------------------- |
| `.bg-brand-gradient`   | `#8ECAE6 → #219EBC`, for dark backgrounds/fills          |
| `.text-brand-gradient` | `#2E90C4 → #1E7AAB` gradient text, for light backgrounds |
| `.glass`               | Frosted panel — translucent white + `blur(16px)`         |
| `.spotlight`           | Dark band that sets its own text colours                 |

This is a **light theme by design**. The "spotlight" tokens are intentionally
dark sections inside a light page, not an OS dark mode, so no
`prefers-color-scheme` inversion is applied.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # root layout, fonts, metadata
│   ├── page.tsx          # home page (placeholder — replace it)
│   ├── error.tsx         # error boundary
│   ├── not-found.tsx     # 404
│   └── globals.css       # Tailwind import + all theme tokens
└── lib/
    ├── urls.ts           # deployment URLs / fallbacks (single source of truth)
    ├── env.ts            # validated environment access
    └── api.ts            # the backend client
```

Add components under `src/components/`, and use the `@/` alias for imports
(`@/lib/api`, `@/components/Button`).

---

## What is configured for you

- **React Compiler** — automatic memoisation; you rarely need `useMemo`/`useCallback`.
- **Typed routes** — `<Link href="/typo">` fails at compile time.
- **Security headers** — CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, and
  friends, set in `next.config.ts`. The CSP's `connect-src` is derived from
  `NEXT_PUBLIC_API_URL`, so it cannot drift from the API client.
- **Prettier + Tailwind class sorting** — `npm run format`.
- **CI on `main`** — format, lint, typecheck, and build on every push and PR.
