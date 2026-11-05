import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

// Count maintained site source, excluding blank lines, tooling and bundled assets.
const sourceFiles = ['index.html', 'styles.css', 'js/app.js', 'js/science.js'];
const sources = await Promise.all(sourceFiles.map(path => readFile(path, 'utf8')));
const sourceLines = sources.reduce((total, source) => total + source.split(/\r?\n/).filter(line => line.trim()).length, 0);
const languageBytes = { HTML: 0, CSS: 0, JavaScript: 0 };
sourceFiles.forEach((path, index) => {
  const language = path.endsWith('.html') ? 'HTML' : path.endsWith('.css') ? 'CSS' : 'JavaScript';
  languageBytes[language] += Buffer.byteLength(sources[index], 'utf8');
});
const totalBytes = Object.values(languageBytes).reduce((total, bytes) => total + bytes, 0);
const languageBreakdown = Object.entries(languageBytes).map(([language, bytes]) => `<span>${language} <b>${(100 * bytes / totalBytes).toFixed(1)}%</b></span>`).join('');
const countSlot = '<span data-source-lines>Counted at build time</span>';
const languageSlot = '<dd class="language-breakdown" data-language-breakdown>HTML, CSS & JavaScript</dd>';
if (!sources[0].includes(countSlot)) throw new Error('Missing source line count in About this site.');
if (!sources[0].includes(languageSlot)) throw new Error('Missing language breakdown in About this site.');

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html', 'styles.css', 'js', 'assets', '.nojekyll']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await writeFile('dist/index.html', sources[0]
  .replace(countSlot, `<span data-source-lines>${sourceLines.toLocaleString('en-IE')}</span>`)
  .replace(languageSlot, `<dd class="language-breakdown" data-language-breakdown>${languageBreakdown}</dd>`));
console.log('Built RE-ENTRY → dist/ (static, no runtime dependencies)');
