const config = require("./webpack.oauth2");

module.exports = {
	publicPath: config.output.publicPath,
	contentBase: "/client/build/",
	filename: "bundle.oauth2.js",
	watchOptions: {
		aggregateTimeout: 0
	},
	hot: true,
	inline: false,
	stats: {
		colors: true,
		assets: true,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: false,
		version: true
	}
};
