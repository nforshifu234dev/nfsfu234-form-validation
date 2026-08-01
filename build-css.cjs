// build-css.js
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

async function buildCss() {
  const cssDir = path.resolve('src/css');
  const distDir = path.resolve('dist/css');

  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));

  for (const file of cssFiles) {
    const filePath = path.join(cssDir, file);
    const css = fs.readFileSync(filePath, 'utf8');

    // Process original CSS
    const originalOutput = await postcss([autoprefixer]).process(css, {
      from: filePath,
      to: path.join(distDir, file),
      map: { inline: false }, // Generate source maps
    });
    fs.writeFileSync(path.join(distDir, file), originalOutput.css);
    fs.writeFileSync(path.join(distDir, `${file}.map`), originalOutput.map.toString());
    console.log(`Processed and moved original ${file} to ${distDir}`);

    // Process minified CSS
    const minifiedFile = file.replace('.css', '.min.css');
    const minifiedOutput = await postcss([autoprefixer, cssnano]).process(css, {
      from: filePath,
      to: path.join(distDir, minifiedFile),
      map: { inline: false }, // Generate source maps
    });
    fs.writeFileSync(path.join(distDir, minifiedFile), minifiedOutput.css);
    fs.writeFileSync(path.join(distDir, `${minifiedFile}.map`), minifiedOutput.map.toString());
    console.log(`Processed and moved minified ${minifiedFile} to ${distDir}`);
  }

  const typesDir = path.resolve("dist/types");

  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  fs.copyFileSync(
    path.resolve("src/types/css.d.ts"),
    path.join(typesDir, "css.d.ts")
  );

  console.log("Copied css.d.ts to dist/types");

  }

buildCss().catch(err => console.error('Error processing CSS:', err));
