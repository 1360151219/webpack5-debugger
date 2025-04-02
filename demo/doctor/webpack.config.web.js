const path = require("path"); //node环境当前路径
module.exports = {
	entry: {
		app: "./web/index.tsx" //找到咱们刚才在src下面的入口文件
	},
	output: {
		path: path.resolve(__dirname, "dist_web"), //打包文件输出的地址
		filename: "web.js",
		clean: true //webpack5新增的，每次打包前删除旧的dist包文件
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devServer: {
		port: 8080
	},
	module: {
		rules: [
			{
				test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
				use: "babel-loader"
			},
			{
				test: /\.(jpg|png|gif|svg)$/, //处理图片文件打包
				type: "asset", //webpack5新增的处理静态资源的loader，替换之前的url-loder、file-loader,具体的可以官方文档
				parser: {
					dataUrlCondition: {
						maxSize: 100 * 1024 //最大100kb的文件会被转成base64，大于100kb的文件会转成图片文件
					}
				},
				generator: {
					filename: "static/images/[name]_[contenthash:8][ext]" //最终图片文件输出的路径
				}
			},
			{
				test: /\.(css|scss|sass)$/,
				use: [
					//loader 顺序是自下而上执行，所以顺序一定不要错
					"style-loader",
					"css-loader", //如果需要使用css module模式的话，在这个loader里面添加配置即可，自己百度下
					"sass-loader"
				]
			}
		]
	}
};
