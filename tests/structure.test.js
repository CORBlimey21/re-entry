import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
test('every internal link resolves and all document IDs are unique', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Missing anchor #${id}`);
});
test('all local HTML and CSS dependencies exist, including the bundled font files', async () => {
  for (const [, path] of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) await access(new URL(`../${path}`, import.meta.url));
  const fontCSS = await readFile(new URL('../assets/fonts/fonts.css', import.meta.url), 'utf8');
  for (const [, path] of fontCSS.matchAll(/url\(\.\/([^)]+)\)/g)) await access(new URL(`../assets/fonts/${path}`, import.meta.url));
});
test('all six educational chapters and seventeen cited sources are present', () => {
  for (const id of ['energy', 'heating', 'plasma', 'shield', 'descent', 'simulation']) assert.ok(html.includes(`id="${id}"`));
  assert.equal([...html.matchAll(/<li id="ref-\d+"/g)].length, 17);
});
