import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html', 'styles.css', 'js', 'assets', '.nojekyll']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Built RE-ENTRY → dist/ (static, no runtime dependencies)');
