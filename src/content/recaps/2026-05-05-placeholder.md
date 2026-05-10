---
headline: "DEV FIXTURE — do not deploy"
dek: "Internal placeholder used to keep the recap collection non-empty during development. Filtered out of the homepage and detail routes by placeholder:true."
date: 2026-05-05
readTime: 1
placeholder: true
---

## This file should never render

If you are seeing this content on a public page, the placeholder filter has regressed. The homepage and `/recaps/[slug]` routes both filter on `placeholder: true` and the homepage build will throw if a placeholder leaks through.

This file should be removed from the repo as a follow-up cleanup once a real recap exists.
