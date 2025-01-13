const path = require("path");
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".js"]
	},
	// plugins: [new BundleAnalyzerPlugin()],
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
