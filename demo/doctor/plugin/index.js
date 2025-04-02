const http = require("http");
const opener = require("opener");
const WebSocket = require("ws");
const fs = require("fs");

const { renderViewer } = require("./viewer");
const { resolve } = require("path");
class WebpackBundleAnalyzer {
	constructor(options) {
		this.options = options;
		this.server = null;
		this.wss = null;
	}

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
				stats: JSON.stringify(stats, null, 4)
			});
			res.end(html);
		});

		await new Promise(resolve => {
			this.server.listen(3000, () => {
				console.log("sevrer start");
				opener("http://localhost:3000");
				resolve();
			});
		});

		const wss = new WebSocket.Server({ server: this.server });
		this.wss = wss;
		wss.on("connection", ws => {
			ws.on("error", err => {
				if (err.errno) return;
				console.info(err.message);
			});
		});
	}

	updateChartData(chartData) {
		console.log("=====updateChartData");
		this.wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify({ event: "chartDataUpdated", data: chartData })
				);
			}
		});
	}

	apply(compiler) {
		compiler.hooks.done.tap("WebpackBundleAnalyzer", stats => {
			if (this.server) {
				this.updateChartData(stats.toJson());
				return;
			}
			this.startServer(stats.toJson());
		});
	}
}
module.exports = WebpackBundleAnalyzer;
