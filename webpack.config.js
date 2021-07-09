const path = require('path');

module.exports = {
	mode: 'development',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
		library: {
			name: 'UndoBuffer',
			type: 'umd',
		},
		publicPath: '/undo-buffer/',
	},
	module: {
		rules: [
			{
				test: /worker\.js$/,
				loader: require.resolve('worker-loader'),
				options: {
					esModule: false,
					//inline: 'no-fallback',
					publicPath: '/undo-buffer/',
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
			},
		],
	},
};
