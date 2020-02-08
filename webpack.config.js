/**
 * Webpack configuration.
 */
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const WebpackBar = require( 'webpackbar' );

const commonConfig = {
	module: {
		rules: [
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
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}
		],
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: '[name]/style.css',
		} ),
	],
};

const adminCSS = {
	entry: {
		'admin': './assets/src/admin/scss/style.scss'
	},
	output: {
		path: path.resolve( __dirname, 'assets/build' ),
	},
	module : {
		rules: [
			...commonConfig.module.rules
		]
	},
	plugins: [
		...commonConfig.plugins,
		new WebpackBar( {
			name: 'Admin Styles',
			color: '#6a5407',
		} ),
	],
};

const mainAPP = {
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
			...commonConfig.module.rules
		],
	},
	plugins: [
		...commonConfig.plugins,
		new WebpackBar( {
			name: 'Admin APP',
			color: '#808080',
		} ),
		new DependencyExtractionWebpackPlugin(),
	]
};

module.exports = [
	adminCSS,
	mainAPP
];
