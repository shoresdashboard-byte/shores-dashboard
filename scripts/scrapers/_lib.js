import Parser from 'rss-parser';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(__dirname, '..', '..', 'src', 'data');

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'ShoresDashboard/0.1 (+https://shoresdashboard.com; civic information aggregator)'
  }
});

/**
 * Fetch and parse an RSS feed. Returns normalized items.
 * Each item: { id, title, link, isoDate, snippet, source }
 */
export async function fetchFeed(url, sourceName) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map(item => ({
      id: item.guid || item.link,
      title: (item.title || '').trim(),
      link: item.link,
      isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
      snippet: cleanSnippet(item.contentSnippet || item.content || ''),
      source: sourceName
    })).filter(i => i.title && i.link);
  } catch (err) {
    console.error(`[${sourceName}] feed error:`, err.message);
    return [];
  }
}

/**
 * Strip HTML, collapse whitespace, truncate to ~240 chars.
 * We never republish full content — this is a preview only.
 */
function cleanSnippet(text) {
  const stripped = String(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (stripped.length <= 240) return stripped;
  return stripped.slice(0, 237).trimEnd() + '…';
}

/**
 * Merge new items with existing data, dedupe by id, keep newest 100.
 */
export async function writeData(filename, newItems) {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  const path = join(DATA_DIR, filename);

  let existing = [];
  if (existsSync(path)) {
    try {
      existing = JSON.parse(await readFile(path, 'utf8'));
    } catch {
      existing = [];
    }
  }

  const seen = new Set();
  const merged = [...newItems, ...existing]
    .filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
    .slice(0, 100);

  await writeFile(path, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`[${filename}] ${newItems.length} fetched, ${merged.length} total stored`);
  return merged;
}
