/**
 * Webpack configuration.
 */

const path = require( 'path' );

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

const env = process.env.NODE_ENV;

module.exports = {
	entry: {
		app: './assets/src/modules/index.js',
	},
	output: {
		path: path.resolve( __dirname, 'assets/build' ),
		filename: '[name]/index.js'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_module/,
				use: 'babel-loader',
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: '[name]/style.css',
		} ),
	]
};
