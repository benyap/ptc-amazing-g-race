var DEBUG = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');

module.exports = {
	entry: {
		'main': ['babel-polyfill', './src/client/main.js'],
		'admin': ['babel-polyfill', './src/client/admin.js']
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['react', 'es2015', 'stage-0'],
							plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' }
				]
			},
			{
				test: /\.(jpg|gif|png|svg|woff|woff2|eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: 'file-loader', options: {name: '[name].[ext]'}
			}
		]
	},
	output: {
		path: __dirname + '/../public',
		filename: '[name].min.js',
		publicPath: '/'
	},
	plugins: DEBUG ? [] : [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourceMap: false})
	]
};
