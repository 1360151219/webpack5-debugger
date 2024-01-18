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
	plugins: [new BundleAnalyzerPlugin()],
	optimization: {
		splitChunks: {
			minSize: 0,
			minChunks: 1,
			cacheGroups: {
				// defaultVendors: {
				// 	test: /[\\/]node_modules[\\/]/,
				// 	priority: -10,
				// 	reuseExistingChunk: true
				// },
				// default: {
				// 	minChunks: 2,
				// 	priority: -20,
				// 	reuseExistingChunk: true
				// },
				lodashForin: {
					// 我们只针对lodash的forIn函数
					test: /[\\/]node_modules[\\/](lodash)/,
					name: "lodash-forin",
					filename: "forin.js",
					chunks: "all"
				}
			}
		}
	}
};
