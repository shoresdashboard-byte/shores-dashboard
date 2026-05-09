import { fetchFeed, writeData } from './_lib.js';

/**
 * C&G Newspapers — St. Clair Shores Sentinel.
 * RSS URL pattern is candgnews.com/newspaper/stclairshoressentinel/feed
 * (verify exact path on first live run; fallback handled by fetchFeed).
 */
const FEED_URL = 'https://candgnews.com/newspaper/stclairshoressentinel/feed';

async function main() {
  const items = await fetchFeed(FEED_URL, 'C&G — SCS Sentinel');
  await writeData('cgnews.json', items);
}

main().catch(err => {
  console.error('C&G scraper failed:', err);
  process.exit(1);
});
