var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './public');
var APP_DIR = path.resolve(__dirname, './');
var MODULES_DIR = path.resolve(__dirname, './node_modules');

var config = {
	// context: path.resolve(__dirname, '../'),
	context: APP_DIR,
	mode: 'development',
	entry: APP_DIR + '/index.jsx',
	output: {
		path: BUILD_DIR,
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	devServer:{
		contentBase: BUILD_DIR,
		historyApiFallback: true,
		allowedHosts: [
			'.ngrok.io'
		]
	},
	module : {
		noParse: [/node_modules\/mapbox-gl\/dist\/mapbox-gl.js/],
		rules: [
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loader: 'babel-loader',
				query: {
					presets: ['@babel/preset-env', '@babel/preset-react'].map(require.resolve),
					plugins: ['@babel/plugin-proposal-class-properties'].map(require.resolve)
				}
			},
			{
				test: /\.json?/,
				include: APP_DIR,
				loader: 'json'
			},
			{
				test: /\.sass$/,
				include: APP_DIR,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.css$/,
				include: APP_DIR,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg|eot|woff|woff2|ttf)$/,
				include: [APP_DIR, MODULES_DIR],
				loaders: ['url-loader?limit=50000&name=[path][name].[ext]']
			},
			{
				test: /\.svg(\?.*)?$/,
				include: APP_DIR,
				loaders: [ 'url-loader', 'svg-transform-loader']
			}
		]
	},
	resolve: {
		modules: [__dirname, MODULES_DIR, APP_DIR]
	}
};

module.exports = config;