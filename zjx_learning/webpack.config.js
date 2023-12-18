import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".js"]
	},
	module: {
		rules: [
			{
				test: /\.css$/, // 用正则表达式来匹配需要用该Loader处理的文件类型，这里是.css文件
				use: [
					path.resolve(__dirname, "./loaders/style-loader/dist/cjs.js"),
					path.resolve(__dirname, "./loaders/css-loader/dist/cjs.js")
				]
			},
			{
				test: /\.js$/, // 用正则表达式来匹配需要用该Loader处理的文件类型，这里是.css文件
				use: [path.resolve(__dirname, "./loaders/index.js")]
			}
		]
	}
};
