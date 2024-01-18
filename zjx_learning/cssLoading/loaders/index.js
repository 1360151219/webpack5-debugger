export default function (source) {
	// 在这里对源文件做一些处理
	// source是原始资源（源代码字符串）
	// 返回值将被用作模块的JavaScript源码
	return `// hello world for ZJX
  ${source}`;
};
