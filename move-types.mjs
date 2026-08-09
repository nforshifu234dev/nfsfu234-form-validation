// move-types.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(import.meta.dirname, 'dist');
const jsDir = path.join(distDir, 'js');
const typesDir = path.join(distDir, 'types');

await fs.mkdir(typesDir, { recursive: true });

const files = await fs.readdir(jsDir);
const dtsFiles = files.filter((f) => f.endsWith('.d.ts') || f.endsWith('.d.mts'));

if (dtsFiles.length === 0) {
  throw new Error(`No .d.ts/.d.mts files found in ${jsDir} — tsup DTS build may have failed silently.`);
}

for (const file of dtsFiles) {
  await fs.rename(path.join(jsDir, file), path.join(typesDir, file));
  console.log(`Moved ${file} to types directory`);
}