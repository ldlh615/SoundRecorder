import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/soundrecorder.js',
      format: 'umd',
      sourcemap: true,
      sourcemapFile: 'dist/soundrecorder.map',
      name: 'Soundrecorder',
    },
    {
      file: 'dist/soundrecorder.min.js',
      format: 'umd',
      sourcemap: true,
      sourcemapFile: 'dist/soundrecorder.min.map',
      name: 'Soundrecorder',
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
