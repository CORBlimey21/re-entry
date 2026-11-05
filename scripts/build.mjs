import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

// Count maintained site source, excluding blank lines, tooling and bundled assets.
const sourceFiles = ['index.html', 'styles.css', 'js/app.js', 'js/science.js'];
const sources = await Promise.all(sourceFiles.map(path => readFile(path, 'utf8')));
const sourceLines = sources.reduce((total, source) => total + source.split(/\r?\n/).filter(line => line.trim()).length, 0);
const countSlot = '<span data-source-lines>Counted at build time</span>';
if (!sources[0].includes(countSlot)) throw new Error('Missing source line count in About this site.');

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html', 'styles.css', 'js', 'assets', '.nojekyll']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await writeFile('dist/index.html', sources[0].replace(countSlot, `<span data-source-lines>${sourceLines.toLocaleString('en-IE')}</span>`));
console.log('Built RE-ENTRY → dist/ (static, no runtime dependencies)');
