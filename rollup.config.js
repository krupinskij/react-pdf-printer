import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonJS from 'rollup-plugin-commonjs';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const packageJSON = require('./package.json');

const resolveNonExternals = ({ dir = '', extension = '', nonExternals = [] }) => ({
  resolveId: (source) => {
    if (nonExternals.some((nonExternal) => source.startsWith(nonExternal))) {
      return `${dir}/${source}${extension}`;
    }
  },
});

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
      typescript({
        tsconfig: './tsconfig.json',
      }),
      postcss(),
      terser(),
    ],
  },
  {
    input: 'src/style.css',
    output: [{ dir: 'dist' }],
    plugins: [postcss({ extract: 'style.css' })],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      resolveNonExternals({
        dir: 'dist/esm/types',
        extension: '.d.ts',
        nonExternals: ['components', 'context', 'hooks', 'utilities', 'model'],
      }),
      dts(),
    ],
  },
];
