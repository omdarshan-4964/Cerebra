# Deployment guide — Vercel

This document explains the minimal steps to deploy the Next.js (app directory) project to Vercel and important production notes.

1) Prepare environment

- Add the Gemini API key to your Vercel project environment variables:
	- Key: `GEMINI_API_KEY`
	- Value: (your Gemini API key)
	- Set it for `Production` (and `Preview` if you want preview deployments to work).

- (Optional) Add `NEXT_PUBLIC_*` vars if you have any public runtime configuration.

2) Vercel configuration

- This repo includes `vercel.json` which sets a reasonable memory/time for the serverless function used by `/api/generate`.
- We set `export const runtime = 'nodejs'` in `app/api/generate/route.ts` so the Gemini SDK runs in a Node environment (not Edge).

3) Build & Deploy

- From your repo root run locally to verify build:

```powershell
npm install
npm run build
npm run start
```

- Push your branch to GitHub and create a Vercel project (or import this repository). Vercel will detect Next.js and use the `@vercel/next` builder.

4) Runtime considerations

- The AI call happens server-side in `/api/generate`. Ensure `GEMINI_API_KEY` is set in Vercel.
- We added curated roadmap templates to avoid calling the model for common topics — this reduces latency and improves reliability.
- The route uses Node runtime to support the official Gemini SDK which requires Node APIs.

5) Testing the deployment

- After deployment, use the UI to generate maps for the example topics: Web Development, Machine Learning, Python Programming, React.js, Data Science, Cloud Computing.
- You can also POST to the route directly:

```powershell
Invoke-RestMethod -Uri https://<your-vercel-app>.vercel.app/api/generate -Method POST -Body (ConvertTo-Json @{ topic='Python Programming'; difficulty='beginner' }) -ContentType 'application/json'
```

6) Troubleshooting

- If you get errors mentioning `GEMINI_API_KEY` missing, verify the environment variable name and that the project is using the correct scope (production).
- If the API returns non-JSON, open the server logs in Vercel to capture the raw response from the Gemini SDK. Consider adding additional logging if necessary.
- If you see timeouts, increase the `maxDuration` in `vercel.json` or implement an asynchronous job queue (for long running generation).

7) Security

- Never commit secret keys into the repository. Use Vercel environment variables.
- Limit any client-side exposure — keys should only be used server-side.

If you want, I can:
- Add CI checks to ensure builds succeed before deployment.
- Add server-side logging to capture raw Gemini responses for debugging.
- Add a simple health endpoint that returns status and whether `GEMINI_API_KEY` is configured.
