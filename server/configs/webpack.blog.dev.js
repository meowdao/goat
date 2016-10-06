const config = require("./webpack.blog");

module.exports = {
	publicPath: config.output.publicPath,
	contentBase: "/client/build/",
	filename: "bundle.blog.js",
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
