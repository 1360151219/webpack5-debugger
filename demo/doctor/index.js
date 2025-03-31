const _  =  require('lodash')
const b = _.add(99,1);
import("./a.js").then(res => {
	console.log(res,b);
});
