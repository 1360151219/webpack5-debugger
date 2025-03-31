## starter

```
npm i
npm run build:web
npm run build
```

## Article

最近字节开源了 rsdoctor 项目（一站式智能构建分析器），在项目日渐成熟并持续迭代的过程中，rsdoctor可以帮助我们进行项目的性能分析，避免项目性能劣化。甚感兴趣，于是我想要从大家更熟悉的 Webpack Bundle Analyzer 插件入手，揭晓前端项目构建分析的技术细节。

在学习过程中，我将从零实现一个简单的 Webpack Bundle Analyzer 插件，逐步深入理解 Webpack 的构建分析原理。

## Starter

首先，我们需要初始化一个简单的 Webpack 插件：

```js
class WebpackBundleAnalyzer {
	constructor(options) {
		this.options = options;
	}

  apply(compiler) {
		compiler.hooks.done.tap("WebpackBundleAnalyzer", stats => {
      console.log(stats.toJson())
		});
	}
}
```

我们可以通过监听 Webpack 的 `done` 钩子，在构建完成后获取到 Webpack 的构建统计数据。然后就可以对 `stats` 进行分析并展示了。

是不是听起来很简单，这就是 Webpack Bundle Analyzer 最关键的核心原理。但是除此之外，我们还需要考虑以下几个问题：

1. 如何在构建过程中自动打开页面进行分析结果展示？
2. 如何在webpack二次构建时自动更新页面分析结果？

解决了这两个问题，我们就基本上实现了一个完整的 Webpack Bundle Analyzer 插件了。


## problem1

为了在构建过程中打开一个页面，我们首先需要实现一个空白页面展示。（我这里直接用react写了个简单页面，然后构建出产物`dist_web/web.js`）
```js
import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app";

window.addEventListener(
	"load",
	() => {
		const container = document.getElementById("app");
		const root = createRoot(container!);
		root.render(
			<ContextProvider>
				<App />
			</ContextProvider>
		);
	},
	false
);


// app.tsx

import React from "react";
export default function App() {
	return <div> app </div>;
}

```

然后，我们需要在构建过程中，启动一个 http 服务，它将帮助我们完成静态资源的分发（html、js）以及借助 `opener` 自动打开页面。
```js
const opener = require("opener");
const { escape } = require("html-escaper");

	async startServer(stats) {
		this.server = http.createServer((req, res) => {
			if (req.url.includes("/web.js")) {
				res.writeHead(200, { "Content-Type": "application/javascript" });
				res.end(
					fs.readFileSync(resolve(__dirname, "../dist_web/web.js"), "utf-8")
				);
				return;
			}
			res.writeHead(200, { "Content-Type": "text/html" });
			const html = renderViewer({
				title: "test",
				stats
			});
			res.end(html);
		});

		await new Promise(resolve => {
			this.server.listen(3000, () => {
				opener("http://localhost:3000");
				resolve();
			});
		});
	}


 renderViewer({ title, stats }){
    return `
    <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script>
      window.bundleStats = ${stats};
    </script>
  </head>
  <body>
    <div id="app">
    </div>
    <script src=${escape("web.js")}></script>
  </body>
  </html>
    `;
  };

  apply(compiler) {
		compiler.hooks.done.tap("WebpackBundleAnalyzer", stats => {
			this.startServer(stats.toJson());
		});
	}
```

至此，一个在 Webpack 构建过程中能够自动打开页面的功能就实现啦。




