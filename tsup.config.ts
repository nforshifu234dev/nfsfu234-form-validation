// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/ts/nfsfu234FormValidation.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: {
    entry: 'src/ts/nfsfu234FormValidation.ts',
  },
  outDir: 'dist/js',
  minify: true,
  sourcemap: true,
  outExtension({ format }) {
    if (format === 'cjs') return { js: '.cjs' };
    if (format === 'iife') return { js: '.global.js' };
    return { js: '.mjs' };
  }
});