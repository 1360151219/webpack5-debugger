# Webpack5源码解读

> 本文clone的webpack版本为5.88.2

## 调试

1. `git clone https://github.com/webpack/webpack.git` 克隆webpack的仓库。
2. 在克隆下来的目录中下载依赖：`npm install`。
3. 将webpack链接到全局变量中：`npm link`。
4. 创建调试项目，在项目中把webpack链接进依赖中：`npm link webpack`。
5. 在vscode中新建debug终端，在源码中打断点，并且执行`webpack`，即可开始调试之旅。

调试项目示例代码如下：


```js
// index.js

const a = require("./a.js");
console.log(a);

// a.js

const a = 1;

module.exports = {
	a
};


// webpack.config.js
module.exports = {
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "bundle.js"
	}
};
```

## 入口

```js
// /lib/webpack.js
const cli = {
	name: "webpack-cli",
	package: "webpack-cli",
	binName: "webpack-cli",
	installed: isInstalled("webpack-cli"),
	url: "https://github.com/webpack/webpack-cli"
};

if (!cli.installed) {
  // 当前项目目录下是否下载了webpack-cli，如果没有则执行 npm install webpack-cli -D
} else {
  // 引入webpack-cli
	runCli(cli);
}


```

## 开始

我们以一个最简单的调试项目来进行调试，运行`webpack --mode=development`：

### webpack函数

我们主要先由入口文件： `/lib/webpack.js` 开始看起。

```js
const webpack = /** @type {WebpackFunctionSingle & WebpackFunctionMulti} */ (
	/**
	 * @param {WebpackOptions | (ReadonlyArray<WebpackOptions> & MultiCompilerOptions)} options options
	 * @param {Callback<Stats> & Callback<MultiStats>=} callback callback
	 * @returns {Compiler | MultiCompiler} Compiler or MultiCompiler
	 */
	(options, callback) => {
// @read 【第一步：入口】
		debugger;
		const create = () => {
			if (!asArray(options).every(webpackOptionsSchemaCheck)) {
				getValidateSchema()(webpackOptionsSchema, options);
				util.deprecate(
					() => {},
					"webpack bug: Pre-compiled schema reports error while real schema is happy. This has performance drawbacks.",
					"DEP_WEBPACK_PRE_COMPILED_SCHEMA_INVALID"
				)();
			}
			/** @type {MultiCompiler|Compiler} */
			let compiler;
			/** @type {boolean | undefined} */
			let watch = false;
			/** @type {WatchOptions|WatchOptions[]} */
			let watchOptions;
			if (Array.isArray(options)) {
			//...
			} else {
            // @read 【🌟第三步：createCompiler】
				const webpackOptions = /** @type {WebpackOptions} */ (options);
				/** @type {Compiler} */
				compiler = createCompiler(webpackOptions);
				watch = webpackOptions.watch;
				watchOptions = webpackOptions.watchOptions || {};
			}
			return { compiler, watch, watchOptions };
		};
		if (callback) {
			//...
		} else {
// @read 【第二步：执行create】
			const { compiler, watch } = create();
			return compiler;
		}
	}
);
```

一般我们在使用`webpack [...]`cli指令的时候，都是没有`callback`的，这里我们可以先忽略。我们可以发现其实`webpack`暴露出去的只是一个函数，函数内执行了`create`方法。webpack函数接收`options`和`callback`两个参数，其中`options`就是调试项目中的`webpack.config.js`中暴露出来的一个函数。

![](https://files.mdnice.com/user/37776/57319534-0f06-4406-9565-99be5baaa0ec.png)

因此在`create()`方法中，走的是else分支，这里会遇到一个关键的函数叫做`createCompiler`。

### createCompiler函数

```js
const createCompiler = rawOptions => {
	// @read 【createCompiler函数，标准化Webpack Options】
	const options = getNormalizedWebpackOptions(rawOptions);
	
	applyWebpackOptionsBaseDefaults(options);
	const compiler = new Compiler(
		/** @type {string} */ (options.context),
		options
	);
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else if (plugin) {
				plugin.apply(compiler);
			}
		}
	}
	applyWebpackOptionsDefaults(options);
	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();
	new WebpackOptionsApply().process(options, compiler);
	compiler.hooks.initialize.call();
	return compiler;
};
```

首先第一步是标准化Webpack配置Options，还记得我们本次调试的Options嘛，里面只有`entry`、`output`和`mode`属性，那么在这个函数中，我们来主要关注几个地方：

1. entry

```js
const getNormalizedWebpackOptions = config => ({
  ...
  entry: getNormalizedEntryStatic(config.entry),
  ...
})

// 标准化entry属性
const getNormalizedEntryStatic = entry => {
	if (typeof entry === "string") {
		return {
			main: {
				import: [entry]
			}
		};
	}
  ...
}
```

本调试中，`entry: './index.js'`，因此序列化为一个对象，用于记录整个项目主要的依赖。这里用一个数组是因为webpack还支持多入口打包，能够构建出MPA项目：
```js
entry: {
  main: {
    import: ['./index,js']
  }
}
```




