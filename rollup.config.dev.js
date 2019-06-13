import babel from "rollup-plugin-babel";

export default {
	input: "src/main.js",
	output: {
		file: "dist/soundRecorder.js",
		format: "umd",
		sourcemap: true,
		name: 'SoundRecorder',
	},
	plugins: [
		babel({
			// runtimeHelpers: true,
			// externalHelpers: true,
			exclude: "node_modules/**",
		})
	]
};