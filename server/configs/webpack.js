"use strict";

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	devtool: "source-map",
	entry: [
		"webpack-dev-server/client?http://localhost:3001",
		"webpack/hot/dev-server",
		"./client/assets/js/main"
	],
	output: {
		path: path.join(__dirname, "..", "..", "client", "build"),
		filename: "bundle.js",
		sourceMapFilename: "[file].map",
		// chunkFilename: "[id].js",
		publicPath: "http://localhost:3001/assets/"
	},
	resolve: {
		modulesDirectories: ["node_modules"],
		alias: {
			components: path.join(__dirname, "..", "client", "assets", "js", "components")
		}
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: "json-loader"
			},
			{
				test: /\.less/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
			},
			{
				test: /\.(ttf|woff|woff2|eot|svg|gif|png|ico)(\?.+)?$/,
				loader: "file-loader?name=[sha512:hash:base36:7].[ext]"
			},
			{
				test: /\.js$/,
				loaders: ["react-hot", "babel-loader"],
				exclude: [/node_modules/, /bower_components/]
			}
		]
	},
	plugins: [
		new webpack.NodeEnvironmentPlugin("NODE_ENV", "CRON"),
		new ExtractTextPlugin("style.css", {
			allChunks: true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};
