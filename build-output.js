const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const rootDir = __dirname;
const outDir = path.join(rootDir, 'web-dist');
const reactDistDir = path.join(rootDir, 'react-page-flip-main', 'dist');

const filesToCopy = [
  'index.html',
  'styles.css',
  'script.js',
  'sample.html'
];

const dirsToCopy = [
  'assets',
  'Auth Page',
  'CSS Blossoming Flowers Animation',
  'Images-Snap-Scroll',
  'Snap-Scroll-Section',
  'Start Project Parallax Scrolling Website'
];

async function copyRecursive(src, dest) {
  const stat = await fsp.stat(src);
  if (stat.isDirectory()) {
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src);
    for (const entry of entries) {
      await copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    await fsp.copyFile(src, dest);
  }
}

async function main() {
  await fsp.rm(outDir, { recursive: true, force: true });
  await fsp.mkdir(outDir, { recursive: true });

  for (const file of filesToCopy) {
    const src = path.join(rootDir, file);
    if (fs.existsSync(src)) {
      await copyRecursive(src, path.join(outDir, file));
    }
  }

  for (const dir of dirsToCopy) {
    const src = path.join(rootDir, dir);
    if (fs.existsSync(src)) {
      await copyRecursive(src, path.join(outDir, dir));
    }
  }

  if (!fs.existsSync(reactDistDir)) {
    throw new Error('React dist directory not found. Ensure the Vite build ran successfully.');
  }

  // Copy hashed assets to root /assets so hashed paths resolve
  const distAssets = path.join(reactDistDir, 'assets');
  if (fs.existsSync(distAssets)) {
    await copyRecursive(distAssets, path.join(outDir, 'assets'));
  }

  // Copy flipbook index into its own subdirectory to avoid clobbering root index
  const flipbookDir = path.join(outDir, 'flipbook');
  await fsp.mkdir(flipbookDir, { recursive: true });
  await copyRecursive(path.join(reactDistDir, 'index.html'), path.join(flipbookDir, 'index.html'));

  console.log('web-dist prepared successfully');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
