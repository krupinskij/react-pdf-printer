import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

import rollupConfig from './rollup.config';

const copyConfig = {
  input: './package.json',
  output: {
    dir: 'dist',
  },
  plugins: [
    json({ compact: true, namedExports: false }),
    copy({
      targets: [
        {
          src: './package.json',
          dest: 'dist',
          transform: (contents) => contents.toString().replace(`"prepare": "husky install",`, ''),
        },
      ],
    }),
  ],
};

export default [...rollupConfig, copyConfig];
