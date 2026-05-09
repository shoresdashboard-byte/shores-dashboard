import { fetchFeed, writeData } from './_lib.js';

/**
 * Patch local feeds follow patch.com/{state}/{slug}/rss.xml
 */
const FEED_URL = 'https://patch.com/michigan/stclairshores/rss.xml';

async function main() {
  const items = await fetchFeed(FEED_URL, 'Patch — St. Clair Shores');
  await writeData('patch.json', items);
}

main().catch(err => {
  console.error('Patch scraper failed:', err);
  process.exit(1);
});
