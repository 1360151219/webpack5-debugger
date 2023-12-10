const path = require("path");

module.exports = {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/, // 用正则表达式来匹配需要用该Loader处理的文件类型，这里是.css文件
				use: [path.resolve(__dirname, "./loaders/index.js")]
			}
		]
	}
};
