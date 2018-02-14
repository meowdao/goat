const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
	devtool: "source-map",
	entry: {
		office: ["./client/office"],
		oauth2: ["./client/oauth2"]
	},
	output: {
		path: path.join(__dirname, "..", "..", "..", "build", "bundle"),
		filename: "[name].js",
		sourceMapFilename: "[file].map",
		chunkFilename: "[id].js",
		publicPath: "/bundle/"
	},
	externals: {
		react: "React",
		"react-dom": "ReactDOM",
		// "react-bootstrap": "ReactBootstrap",
		// redux: "Redux",
		// "redux-thunk": "ReduxThunk",
		// "redux-logger": "reduxLogger",
		// inlt: "IntlPolyfill",
		// "intl-locales-supported": "areIntlLocalesSupported",
		// "react-intl": "ReactIntl"
		lodash: "_"
	},
	resolve: {
		extensions: [".json", ".jsx", ".js"],
		modules: [
			"node_modules"
		]
	},
	module: {
		rules: [{
			test: /\.json$/,
			use: [{
				loader: "json-loader"
			}]
		}, {
			test: /\.less$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [{
					loader: "css-loader"
				}, {
					loader: "postcss-loader"
				}, {
					loader: "less-loader"
				}]
			})
		}, {
			test: /\.(ttf|woff|woff2|eot|svg|gif|png|ico)(\?.+)?$/,
			use: [{
				loader: "file-loader?name=[name].[ext]?[hash]"
			}]
		}, {
			test: /\.jsx?$/,
			exclude: [/node_modules/],
			use: [{
				loader: "babel-loader",
				options: {
					babelrc: false,
					presets: ["@babel/react", [
						"@babel/env",
						{
							targets: {
								browsers: ["last 2 versions"]
							}
						}
					]],
					plugins: [
						"@babel/proposal-decorators",
						"@babel/proposal-class-properties",
						"@babel/proposal-function-bind",
						"@babel/proposal-object-rest-spread",
						"@babel/transform-runtime",
						"lodash"
					]
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new webpack.optimize.CommonsChunkPlugin("vendor"),
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: "[name].css",
			allChunks: true
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new ProgressBarPlugin()
	],
	performance: {
		hints: false
	}
};
