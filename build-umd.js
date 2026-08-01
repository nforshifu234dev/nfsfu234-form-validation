// build-umd.js
const { build } = require('esbuild');

build({
  entryPoints: ['src/ts/nfsfu234FormValidation.ts'],
  bundle: true,
  format: 'umd',
  globalName: 'NFSFU234FormValidation',
  outfile: 'dist/nfsfu234FormValidationss.umd.js',
  sourcemap: true,
  minify: true,
  target: ['es5'],
}).catch(() => process.exit(1));
