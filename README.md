# PM AI Portfolio — Data Governance Agent

A live tool that analyzes product/service attribute data for completeness gaps,
naming inconsistencies, and orphaned relationships — the same discipline used
in PIM / offer data governance roles.

## Files
- `index.html` — the frontend UI (paste data, click run, see report)
- `api/analyze.js` — Vercel serverless function that securely calls the Claude API

## Deploy (free, ~10 minutes)

1. Push this folder to a new GitHub repository (e.g. `pm-ai-portfolio`).
2. Go to https://vercel.com and sign up/log in with your GitHub account (free).
3. Click "Add New Project" → select your `pm-ai-portfolio` repo → Import.
4. Before deploying, go to "Environment Variables" and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Claude API key (get one at https://console.anthropic.com)
5. Click Deploy. You'll get a live URL like `pm-ai-portfolio.vercel.app`.
6. Test it: click "Load sample dataset" then "Run Governance Check."

## Notes
- The API key is stored server-side only (in Vercel's environment variables) —
  it never appears in the browser or in your GitHub repo. Never paste your
  actual API key into `analyze.js` directly.
- Each analysis costs a small fraction of a cent in API usage. Fine for demo/portfolio use.
- To add more agents later, just add more HTML pages + matching `/api/*.js` files
  in the same repo — they'll all deploy together.
