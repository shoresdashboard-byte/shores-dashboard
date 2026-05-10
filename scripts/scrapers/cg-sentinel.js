import { fetchFeed, writeData } from './_lib.js';

/**
 * C&G Newspapers — St. Clair Shores Sentinel.
 *
 * C&G publishes only one RSS feed for the entire 21-paper network at
 * /rss.xml. We pull that and filter to items relevant to St. Clair Shores.
 *
 * Filter logic (item is kept if ANY of these match):
 *   1. RSS <category> contains "St. Clair Shores Sentinel" (per-paper tag
 *      that C&G assigns to articles published in the SCS edition).
 *   2. Title begins with "ST. CLAIR SHORES" (their convention for the
 *      dateline on local stories — catches anything missing the per-paper
 *      tag but obviously about the city).
 *
 * If C&G changes the feed structure or stops including categories, the
 * title-prefix path keeps us getting the most important local items.
 */
const FEED_URL = 'https://www.candgnews.com/rss.xml';
const SCS_CATEGORY = 'st. clair shores sentinel';
const SCS_TITLE_PREFIX = 'ST. CLAIR SHORES';

function isSCSItem(item) {
  const cats = (item.categories || []).map(c =>
    String(typeof c === 'string' ? c : (c && c._) || '').toLowerCase()
  );
  if (cats.some(c => c.includes(SCS_CATEGORY))) return true;

  const title = String(item.title || '').trim();
  if (title.toUpperCase().startsWith(SCS_TITLE_PREFIX)) return true;

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
