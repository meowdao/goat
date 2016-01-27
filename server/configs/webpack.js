"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

//const prod = process.env.NODE_ENV === 'production';

const config = {
	entry: [
		'./client/assets/js/main'
	],
	output: {
		path: path.join(__dirname, "..", "..", "client", "build"),
		filename: "bundle.js",
		sourceMapFilename : "[file].map",
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
						"transform-decorators-legacy"
					]
				}
			}
		]
	},
	plugins: [
		new webpack.NodeEnvironmentPlugin("NODE_ENV", "CRON", "TWILIO_API", "LOOKUP_API"),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin("style.css", {
			allChunks: true
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin()
	]
};

if (process.env.NODE_ENV == "production") {

	config.devtool = 'source-map';

	config.plugins.unshift(
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
	);

} else {
	config.devtool = "source-map"; // ExtractTextPlugin hmr doesn't work with eval

	config.entry.unshift(
		'webpack-hot-middleware/client'
	);

	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	//JS LOADER BABEL
	config.module.loaders[3].query.plugins.push(["react-transform", {
		transforms: [{
			transform: "react-transform-hmr",
			imports: ["react"],
			locals: ["module"]
		}]
	}])
}

module.exports = config;

