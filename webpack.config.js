var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: './build/entry.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: 'babel-loader',
				query: {
					presets: ['es2015']
				},
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [
						{loader: 'css-loader'}, {loader: 'sass-loader'}
					],
					fallback: 'style-loader'
				}),
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|svg|woff|eot|ttf)$/,
				loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						
					}
				}
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('style.css')
	]
}