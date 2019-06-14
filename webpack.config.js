const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env, argv) => {
	const modeEnv = argv.mode
	const isProd = modeEnv == 'production'
	console.log('>>>当前运行模式: ', modeEnv)

	// optimization.minimizer
	let minimizer = []
	if (isProd) {
		minimizer = [
			new UglifyJsPlugin({
				test: /\.js($|\?)/i,
				exclude: /(node_modules|bower_components)/,
				cache: false,
				parallel: true,
				sourceMap: false,
				uglifyOptions: {
					ecma: 6,
					mangle: true,
					compress: true,
				}
			  })
		]
	}

	// outputName
	const outputName = isProd ? 'soundRecorder.min.js' : 'soundRecorder.js'

	return {
		entry: './src/main.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: outputName,
			libraryTarget: 'umd'
		},
		mode: 'production',
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env'],
								plugins: [
									'@babel/plugin-transform-runtime', 
									'@babel/plugin-syntax-dynamic-import'
								]
							},
						},
						{
							loader: 'source-map-loader'
						}
					]
				}
			]
		},
		resolve: {
			extensions: ['.js', '.json'],
			alias: {}
		},
		optimization: {
			minimize: true,
			noEmitOnErrors: true,
			mangleWasmImports: true,
			removeAvailableModules: true,
			removeEmptyChunks: true,
			mergeDuplicateChunks: true,
			minimizer: minimizer
		},
		plugins: [
		]
	}
}