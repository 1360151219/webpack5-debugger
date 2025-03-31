import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app";
import { ContextProvider } from "./context";

// Initializing WebSocket for live treemap updates
let ws;
try {
	if (window.enableWebSocket) {
		ws = new WebSocket(`ws://${location.host}`);
	}
} catch (err) {
	console.warn(
		"Couldn't connect to analyzer websocket server so you'll have to reload page manually to see updates in the treemap"
	);
}

window.addEventListener(
	"load",
	() => {
		// store.defaultSize = `${window.defaultSizes}Size`;
		// store.setModules(window.chartData);
		// store.setEntrypoints(window.entrypoints);
		const container = document.getElementById("app");
		const root = createRoot(container!);

		root.render(
			<ContextProvider>
				<App />
			</ContextProvider>
		);

		if (ws) {
			ws.addEventListener("message", event => {
				const msg = JSON.parse(event.data);

				if (msg.event === "chartDataUpdated") {
					console.log("====message", msg.data);
				}
			});
		}
	},
	false
);
