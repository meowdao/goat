"use strict";

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("../utils/stats");

module.exports = {
	devtool: "eval",
	entry: {
		abl: [
			"webpack-dev-server/client?http://localhost:3001",
			"webpack/hot/dev-server",
			"./assets/js/main"
		]
	},
	output: {
		path: path.join(__dirname, "..", "build"),
		filename: "[hash].js",
		chunkFilename: "[id].js",
		publicPath: "http://localhost:3001/"
	},
	resolve: {
		modulesDirectories: ["node_modules"],
		alias: {
			components: path.join(__dirname, "..", "assets", "js", "components")
		}
	},
	eslint: {
		//configFile: ".eslintrc"
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: "json"
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
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new ExtractTextPlugin("style.css", {
			allChunks: true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.NoErrorsPlugin(),
		new StatsPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
};
