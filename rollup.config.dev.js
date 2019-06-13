import babel from 'rollup-plugin-babel';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/soundrecorder.js',
		format: 'es',
		sourcemap: true
	},
	plugins: [
		babel({
			runtimeHelpers: true,
			externalHelpers: true,
			exclude: 'node_modules/**', // 只编译我们的源代码
			babelrc: false,
			presets: ['@babel/preset-env'],
		})
	]
};