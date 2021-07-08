const path = require('path');

module.exports = {
	mode: (process.env.NODE_ENV === 'production') ? 'production' : 'development',
	/*
	entry: './src/index.js',
	output: {
		//globalObject: 'this',
		//libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
	},
	*/
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
			},
		],
	},
};
