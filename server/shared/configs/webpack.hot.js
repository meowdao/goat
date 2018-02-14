import config from "./webpack.development";

export default {
	publicPath: config.output.publicPath,
	contentBase: "/build/client/",
	filename: config.output.filename,
	watchOptions: {
		aggregateTimeout: 0
	},
	hot: true,
	inline: false,
	stats: {
		colors: false,
		assets: true,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false,
		children: false,
		version: true
	}
};
