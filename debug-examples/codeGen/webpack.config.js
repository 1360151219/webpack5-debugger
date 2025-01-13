const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //模板文件插件，能够自动将打包的css和js加入到模板文件中
module.exports = {
	entry: "./index.js",
	devtool: false,
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js",
		publicPath: ""
	},
	// plugins: [new HtmlWebpackPlugin()],
	resolve: {
		extensions: [".js"]
	}
};
