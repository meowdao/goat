"use strict";

var os = require("os");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var _ = require("lodash");
var StatsPlugin = require("../utils/stats");

var config = {
	entry: {
		abl: ["./assets/js/main"]
	},
	output: {
		path: path.join(__dirname, "..", "build"),
		filename: "[chunkhash].js",
		chunkFilename: "[id].js",
		publicPath: process.env.NODE_ENV === "production" ? "/build/" : "http://127.0.0.1:3001/build/"
	},
	resolve: {
		modulesDirectories: ["node_modules", "bower_components"],
		alias: {
			components: path.join(__dirname, "..", "assets", "js", "components")
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
				test: /\.(ttf|woff|woff2|eot|svg|gif|png)(\?.+)?$/,
				loader: "file-loader?name=[sha512:hash:base36:7].[ext]"
			},
			{
				test: /\.js$/,
				loaders: ["babel-loader?stage=0&optional=runtime"],
				exclude: [/node_modules/, /bower_components/]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
		}),
		new ExtractTextPlugin("style.css", {
			allChunks: true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.NoErrorsPlugin(),
		new StatsPlugin()
	]
};

if (process.env.NODE_ENV === "production") {

	config.devtool = "sourcemap";

	config.plugins.unshift(
		new webpack.optimize.UglifyJsPlugin({
			comments: /a^/,
			compress: {warnings: false}
		})
	);

} else {

	config.devtool = "eval";

	_.find(config.module.loaders, function (loader) {
		return loader.test.source === /\.js$/.source;
	}).loaders.unshift("react-hot");

	config.entry.abl.unshift(
		"webpack-dev-server/client?http://" + os.hostname() + ":3001",
		"webpack/hot/dev-server"
	);

	config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

export default config;
