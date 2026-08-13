# Deploying the frontend to Vercel

Deploy the **backend to Render first** — you need its URL in step 3.

---

## 0. Before you start

You need:

- The GitHub repo pushed to `main` (already done).
- The Render backend URL, e.g. `https://wizcodes-portal-backend.onrender.com`
- A Vercel account: <https://vercel.com>

---

## 1. Import the project

1. Go to <https://vercel.com/new>.
2. **Import Git Repository** → pick `dkcodes121617/wizcodes-portal-frontend`.
   (First time only: **Adjust GitHub App Permissions** to grant access.)

---

## 2. Framework settings

Vercel auto-detects Next.js. Confirm these and change nothing else:

| Field                | Value              |
| -------------------- | ------------------ |
| **Framework Preset** | `Next.js`          |
| **Root Directory**   | `./`               |
| **Build Command**    | `npm run build`    |
| **Output Directory** | *(leave default)*  |
| **Install Command**  | `npm ci`           |
| **Node.js Version**  | `22.x`             |

---

## 3. Environment variable — the important one

Expand **Environment Variables** and add exactly one:

| Key                   | Value                                            | Environments                        |
| --------------------- | ------------------------------------------------ | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://wizcodes-portal-backend.onrender.com`   | Production, Preview, Development ✅ |

Tick **all three** environment checkboxes.

Rules that will save you an hour:

- **No trailing slash.** `https://…onrender.com`, not `https://…onrender.com/`
- **Include `https://`.** A bare hostname fails the build with a clear message.
- This value is **baked in at build time**, not read at runtime. Changing it
  requires a **redeploy**, not just a restart.

If you forget it entirely, the production build **fails on purpose** with a
message telling you where to set it — better than a site that silently fetches
from nowhere.

---

## 4. Deploy

Click **Deploy**. First build takes 2–3 minutes. You get a URL like:

```
https://wizcodes-portal-frontend.vercel.app
```

Open it — you should see the WizCodes scaffold page.

---

## 5. Lock deploys to `main`

`vercel.json` already restricts automatic deploys to `main`. To confirm:

**Project → Settings → Git → Production Branch** = `main`

Preview deployments for other branches are disabled by `vercel.json`
(`git.deploymentEnabled`), so nothing outside `main` ships.

---

## 6. Tell the backend about the frontend

Go back to Render → your service → **Environment** and add:

| Key            | Value                                           |
| -------------- | ----------------------------------------------- |
| `FRONTEND_URL` | `https://wizcodes-portal-frontend.vercel.app`   |

CORS is already `*`, so this is informational — but keep it accurate.

---

## 7. Verify the connection end to end

Open the deployed site, then the browser devtools **Network** tab, and confirm
requests to the backend return `200`. Or check directly from a terminal:

```bash
curl https://wizcodes-portal-backend.onrender.com/api/v1/health/ready
```

Expected: `{"status":"ok","database":"up",...}`

> The very first request after a quiet period may take ~50 seconds — that is the
> Render free-tier cold start, not a bug. See the backend's `DEPLOYMENT.md`
> step 6 for the keep-alive that prevents it.

---

## Custom domain (optional)

1. **Project → Settings → Domains → Add**
2. Enter your domain and follow the DNS instructions.
3. Add `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` so canonical and Open Graph
   URLs are correct, then redeploy.

---

## Troubleshooting

| Symptom                                          | Cause and fix                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Build fails: `NEXT_PUBLIC_API_URL is not set`     | Add it in **Settings → Environment Variables**, then **Redeploy**.                    |
| Build fails: `not a valid absolute URL`           | Missing `https://` scheme.                                                            |
| Site loads, API calls fail with a CORS error      | The backend is asleep or down. Hit `/health` on the Render URL directly.               |
| API calls go to `localhost` in production         | `NEXT_PUBLIC_API_URL` was missing at **build** time. Set it and redeploy.              |
| Changed the variable but nothing happened         | `NEXT_PUBLIC_*` is inlined at build time — trigger a **Redeploy**.                     |
| CSP blocks requests to the backend                | `next.config.ts` allow-lists the origin from `NEXT_PUBLIC_API_URL`; redeploy after changing it. |
