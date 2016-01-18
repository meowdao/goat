"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

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
		chunkFilename: "[id].js",
		publicPath: "/build/"
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
				loader: "json"
			},
			{
				test: /\.less/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
			},
			{
				test: /\.(ttf|woff|woff2|eot|svg|gif|png|ico)(\?.+)?$/,
				loader: "file-loader?name=[name].[ext]?[hash]"
			},
			{
				test: /\.js$/,
				loader: "babel",
				exclude: [/node_modules/],
				query: {
					plugins: [
						["react-transform", {
							transforms: [{
								transform: "react-transform-hmr",
								imports: ["react"],
								locals: ["module"]
							}]
						}]
					]
				}
			}
		]
	},
	plugins: [
		new webpack.NodeEnvironmentPlugin("NODE_ENV", "CRON", "TWILIO_API", "LOOKUP_API"),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin("style.css", {
			allChunks: true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin()
		//new webpack.optimize.UglifyJsPlugin()
	]
};
