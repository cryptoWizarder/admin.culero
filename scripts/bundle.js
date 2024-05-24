const { buildSync } = require('esbuild');

buildSync({
  entryPoints: ['./dist/index.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  outfile: 'bundle.min.js',
  sourcemap: false,
  treeShaking: true,
});
