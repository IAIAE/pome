import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  plugins: [ babel() ],
  output: {
    file: './dist/index.js',
    format: 'umd'
  },
  name: 'pome',
  external: ['praan', 'images', 'layout', 'path', 'fs']
};