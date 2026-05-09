import { fetchFeed, writeData } from './_lib.js';

/**
 * scsmi.net runs CivicEngage. RSS feeds are exposed at /RSSFeed.aspx with
 * ModID and CID query params. We pull News Flash and Calendar (Council).
 *
 * Real feed IDs need to be verified once the site is reachable from the
 * scraper environment — these are the standard CivicEngage module IDs.
 */
const FEEDS = [
  { url: 'https://www.scsmi.net/RSSFeed.aspx?ModID=1&CID=All-newsflash.xml', label: 'City News' },
  { url: 'https://www.scsmi.net/RSSFeed.aspx?ModID=58&CID=All-calendar.xml', label: 'City Calendar' }
];

async function main() {
  const all = [];
  for (const { url, label } of FEEDS) {
    const items = await fetchFeed(url, `City of SCS — ${label}`);
    all.push(...items);
  }
  await writeData('city.json', all);
}

main().catch(err => {
  console.error('City scraper failed:', err);
  process.exit(1);
});
