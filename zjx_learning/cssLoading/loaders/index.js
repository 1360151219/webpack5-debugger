const loader = function normal(content){return content}
loader.pitch = (remainingRequest, prevReq, data) => {
	console.log("===custom loader");
	data.zjx = 1;
};
export default loader;
