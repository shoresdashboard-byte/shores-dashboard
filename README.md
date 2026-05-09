# Shores Dashboard

A public civic information dashboard for St. Clair Shores, Michigan. Aggregates City Council activity, ordinances, news, and meeting videos from official and local sources.

**Live site:** https://shoresdashboard.com *(pending domain registration)*

## What this is

An independent civic project — not affiliated with the City of St. Clair Shores. Headlines and short summaries link out to original sources. Full articles are never republished.

## Sources

| Source | Method | Cadence |
|---|---|---|
| scsmi.net (City of SCS) | RSS — CivicEngage feeds | Every 2 hrs (6 AM – 11 PM ET) |
| C&G Newspapers — SCS Sentinel | RSS | Every 2 hrs (6 AM – 11 PM ET) |
| Patch — St. Clair Shores | RSS | Every 2 hrs (6 AM – 11 PM ET) |
| All sources on Council meeting nights | RSS | Every 30 min, 7–10 PM ET, 1st & 3rd Mondays |

## Stack

- **Astro** — static site generator
- **Cloudflare Pages** — hosting
- **GitHub Actions** — scheduled scrapers + auto-deploy
- **GitHub** — repo + content storage (JSON files in `src/data/`)

## Local development

```bash
npm install
npm run dev          # local preview at http://localhost:4321
npm run scrape       # run all scrapers once, write to src/data/
npm run build        # production build to ./dist
```

## Editorial policy

See [EDITORIAL.md](./EDITORIAL.md). Short version: neutral tone, no partisan framing, no candidate ads, no full-article republishing.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Code: MIT. Content: each item links to its original source under that source's terms.
