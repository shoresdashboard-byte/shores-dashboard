import { fetchFeed, writeData } from './_lib.js';

/**
 * C&G Newspapers — St. Clair Shores Sentinel.
 *
 * C&G publishes only one RSS feed for the entire 21-paper network at
 * /rss.xml. We pull that and filter to items that mention St. Clair
 * Shores in the title or snippet.
 *
 * History: the original filter checked RSS <category> tags and a
 * "ST. CLAIR SHORES" title-prefix dateline. A diagnostic run on the live
 * feed (see debug/cg-sentinel-feed-shape) showed that C&G items have no
 * categories at all and titles use sentence case with no dateline prefix.
 * Both filter paths were always misses. This filter is what works against
 * the actual feed shape.
 *
 * The match is intentionally permissive (any item whose title or snippet
 * mentions "St. Clair Shores") because SCS coverage in the network feed
 * is thin — we'd rather catch occasional historical/feature content than
 * miss real civic news. If it turns out filler dominates real coverage,
 * tighten later.
 */
const FEED_URL = 'https://www.candgnews.com/rss.xml';

// Word-boundary match for "St. Clair Shores" / "St Clair Shores" /
// "St.Clair Shores". The trailing \b on "Shores" prevents matching
// substrings like "Shoresville" (not that any such place exists, but
// hygiene). Case-insensitive.
const SCS_RE = /\bSt\.?\s*Clair\s+Shores\b/i;

function isSCSItem(item) {
  if (SCS_RE.test(item.title || '')) return true;
  if (SCS_RE.test(item.snippet || '')) return true;
  return false;
}

async function main() {
  const all = await fetchFeed(FEED_URL, 'C&G — SCS Sentinel');
  const scsOnly = all.filter(isSCSItem);
  console.log(`[cg-sentinel] ${all.length} fetched, ${scsOnly.length} matched SCS filter`);
  await writeData('cgnews.json', scsOnly);
}

main().catch(err => {
  console.error('C&G scraper failed:', err);
  process.exit(1);
});
