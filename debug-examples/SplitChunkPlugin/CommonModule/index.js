// import { a } from "./a.js";
// import { b } from "./b.js";
// import chunk from "lodash-es/chunk.js";
import "lodash";

// console.log(chunk([1, 2, 3], 2));

import("./a").then(res => {
	console.log(res);
});
import("./b").then(res => {
	console.log(res);
});
