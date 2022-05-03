import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonJS from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import css from 'rollup-plugin-import-css';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';

const packageJSON = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJSON.main,
        format: 'cjs',
        sourcemap: true,
        name: 'ReactPdfPrinter',
      },
      {
        file: packageJSON.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonJS(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      terser(),
    ],
  },
  {
    input: 'src/style.css',
    output: [{ dir: 'dist/esm/types' }],
    plugins: [postcss({ extract: 'style.css' })],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\/.css$/u],
    plugins: [dts(), postcss()],
  },
];
