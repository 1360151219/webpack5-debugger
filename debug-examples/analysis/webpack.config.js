const path = require("node:path");
const WebpackBundleAnalyzer = require("./webpack-bundle-analyzer/lib/BundleAnalyzerPlugin");

module.exports = {
	entry: "./index.js",
	devtool: false,
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js"
	},
	plugins: [
		new WebpackBundleAnalyzer({
			generateStatsFile: true
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				lodashVender: {
					test: /[\\/]node_modules[\\/]lodash/,
					reuseExistingChunk: true,
					chunks: "all",
					filename: "lodashVender.js"
				}
			}
		}
	}
};
