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
					// TODO: Inline inclusion is possible although a SHA256 will be needed for CSP.
					//inline: 'no-fallback',
					// Using publicPath means CSP "worker-src: 'self'" is suffienct.
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
