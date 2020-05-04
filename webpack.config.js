/**
 * Webpack configuration.
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizePlugin = require('imagemin-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const FileManagerPlugin = require('filemanager-webpack-plugin');

// Build All files.
const finalConfig = (mode) => {
	return [
		{
			entry    : {
				'revenue-generator-admin'    : ['./assets/src/js/revenue-generator-admin.js', './assets/src/scss/revenue-generator-admin.scss'],
				'revenue-generator-frontend'    : ['./assets/src/js/revenue-generator-frontend.js', './assets/src/scss/revenue-generator-frontend.scss'],
				'revenue-generator-dashboard': './assets/src/scss/revenue-generator-dashboard.scss',
			},
			output   : {
				path: path.resolve(__dirname, 'assets/build'),
			},
			module   : {
				rules: [
					{
						test   : /\.scss$/,
						exclude: /node_modules/,
						use    : [
							MiniCssExtractPlugin.loader,
							'css-loader',
							'postcss-loader',
							'sass-loader'
						],
					},
					{
						test  : /\.(png|svg)$/,
						loader: 'url-loader?limit=100000'
					},
					{
						test: /\.(woff|woff2|eot|ttf)?$/,
						use: [
							{
								loader: 'url-loader?limit=100000',
								options: {
									name: '[name].[ext]',
								}
							}
						]
					}
				],
			},
			externals: {
				jquery: 'jQuery'
			},
			plugins  : [
				new MiniCssExtractPlugin({
					filename: 'css/[name].css',
				}),
				new WebpackBar({
					name : 'Build Plugin Assets',
					color: '#0c6a22',
				}),
				new CopyPlugin([
					{ from: './assets/src/img', to: 'img' },
				]),
				new CopyPlugin([
					{ from: './assets/src/vendor', to: 'vendor' },
				]),
				new CopyPlugin([
					{ from: './assets/src/vendor', to: 'vendor' },
				]),
				new ImageMinimizePlugin(
					{
						disable: mode !== 'production',
						test   : /\.(jpe?g|png|gif|svg)$/i
					}),
				new FileManagerPlugin({
					onEnd: {
						delete : [
							'./assets/build/revenue-generator-dashboard.js'
						],
					}
				})
			],
		}
	]
};

module.exports = (env, argv) => {
	return finalConfig(argv.mode);
};
