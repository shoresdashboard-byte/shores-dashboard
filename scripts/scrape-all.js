import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scrapers = ['scs-city.js', 'cg-sentinel.js', 'patch.js'];

function run(file) {
  return new Promise(resolve => {
    const proc = spawn('node', [join(__dirname, 'scrapers', file)], { stdio: 'inherit' });
    proc.on('close', code => {
      if (code !== 0) console.error(`${file} exited with code ${code}`);
      resolve();
    });
  });
}

for (const s of scrapers) await run(s);
console.log('All scrapers complete.');
