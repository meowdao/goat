import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import {getServerUrl} from "../../../shared/utils/misc";


export default {
	// https://github.com/facebook/react/blob/master/docs/docs/cross-origin-errors.md
	devtool: "source-map",
	entry: {
		office: ["react-hot-loader/patch", `webpack-hot-middleware/client?path=${getServerUrl("cdn")}/__webpack_hmr`, "./client/office"],
		oauth2: ["react-hot-loader/patch", `webpack-hot-middleware/client?path=${getServerUrl("cdn")}/__webpack_hmr`, "./client/oauth2"]
	},
	output: {
		path: path.join(__dirname, "..", "..", "..", "build", "bundle"),
		filename: "[name].js",
		sourceMapFilename: "[file].map",
		chunkFilename: "[id].js",
		publicPath: `${getServerUrl("cdn")}/bundle/`
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
			test: /\.(le|c)ss$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [{
					loader: "css-loader",
					options: {
						importLoaders: 1
						// sourceMap: true
					}
				}, {
					// https://github.com/postcss/postcss-loader/issues/217
					loader: "postcss-loader",
					options: {
						// sourceMap: true
					}
				}, {
					loader: "less-loader",
					options: {
						// sourceMap: true
					}
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
					presets: [
						"@babel/react",
						[
							"@babel/env",
							{
								modules: false,
								targets: {
									browsers: ["last 2 versions"]
								}
							}
						]
					],
					plugins: [
						"react-hot-loader/babel",
						"@babel/proposal-decorators",
						"@babel/proposal-class-properties",
						"@babel/proposal-function-bind",
						"@babel/proposal-object-rest-spread",
						"lodash"
					]
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin("vendor"),
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: "[name].css",
			allChunks: true
		}),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	performance: {
		hints: false
	}
};
