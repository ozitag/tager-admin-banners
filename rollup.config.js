import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es',
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'TagerAdminBlog',
    },
  ],
  external: [
    'vue',
    '@tager/admin-services',
    '@tager/admin-ui',
    '@tager/admin-layout',
    'path-to-regexp',
  ],
  plugins: [
    typescript(),
    vue(),
    resolve({ extensions: ['.ts', '.js', '.css', '.svg', '.vue'] }),
    commonjs(),
  ],
};
