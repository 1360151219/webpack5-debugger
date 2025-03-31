import React from "react";
import { useStore } from "./context";

export default function App() {
	const {
		state: { data }
	} = useStore();

	console.log("===data", data);
	return <div> app </div>;
}
