import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app";

const container = document.getElementById("app");
console.log("====web.js loaded!", container);
const root = createRoot(container!);

root.render(<App />);
