import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import { eslint } from 'rollup-plugin-eslint';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: [
      {
        name: 'wurd',
        file: pkg.browser,
        format: 'umd',
        plugins: [filesize()],
      },
      {
        name: 'wurd',
        file: 'dist/wurd.min.js',
        format: 'umd',
        plugins: [uglify()],
      },
    ],
    plugins: [
      eslint({ throwOnError: true }),
      resolve(), // so Rollup can find node modules
      commonjs(), // so Rollup can convert node modules to ES modules
      babel({
        // This ensures dependencies are transpiled as well
        exclude: [],
        babelrc: false,
        presets: ['@babel/preset-env'],
      }),
    ]
  },

  // CommonJS (for Node)
  {
    input: 'src/index.js',
    external: ['get-property-value', 'marked'],
    output: { file: pkg.main, format: 'cjs' },
    plugins: []
  },

  // ES module (for bundlers) build.
  {
    input: 'src/index.js',
    external: ['get-property-value', 'marked'],
    output: { file: pkg.module, format: 'es' },
    plugins: [
      babel(),
    ]
  },
];
