# Upgaming Padel — setup for real admin sync on Vercel

This package makes the "Referee Mode" password login actually save results
for everyone (not just the one phone that typed them), by storing results
in a real database (Vercel KV) instead of just the page itself.

## What's in here
- `index.html` — the site (same design as before, now loads/saves results
  through `/api/results` instead of a static snapshot).
- `api/results.js` — a small server function: GET returns the current
  results, POST saves new ones (only if the password matches).
- `package.json` — lists the one dependency (`@vercel/kv`).

## Setup (one time, ~10 minutes)

1. **Replace your project files.** In your existing `vau-eight` Vercel
   project (or repo, if it's connected to GitHub), replace whatever files
   are there now with everything in this folder — `index.html`, the `api`
   folder, and `package.json` — keeping the same folder structure.

2. **Add a KV database.** In the Vercel dashboard, open the project →
   **Storage** tab → **Create Database** → choose **KV** → connect it to
   this project. Vercel adds the required environment variables
   automatically — you don't need to copy any keys yourself.

3. **Set the admin password.** In the project → **Settings** →
   **Environment Variables**, add:
   - Name: `ADMIN_PASSWORD`
   - Value: whatever password you want referees to use
   - Environment: Production (and Preview, if you use preview deploys)

4. **Redeploy.** Push the new files (if it's a GitHub-connected project,
   just commit and push) or redeploy from the dashboard. The KV
   connection and the password only take effect after a redeploy.

## Using it

- Anyone opening the site sees the schedule and live table as before.
- Tapping **Referee Mode** asks for the password once per browser
  (it's remembered for that session). A wrong password shows an error
  and nothing is unlocked.
- Once unlocked, entering set scores saves automatically a moment after
  each edit. Every other phone/browser looking at the site picks up the
  change within about 8 seconds (it checks for updates automatically —
  no refresh needed).

## Notes
- The password is checked on the server, not just in the page — so
  reading the page's source code will not reveal it.
- If two referees save at almost the exact same moment, the last save
  wins (same trade-off as before) — very unlikely in practice.
- To change the password later, just update `ADMIN_PASSWORD` in Vercel's
  environment variables and redeploy.
