const { escape } = require("html-escaper");

const renderViewer = ({ title, stats }) => {
	return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <div id="app">
  </div>
   <script src=${escape("web.js")}></script>
</body>
</html>
  `;
};

module.exports = {
	renderViewer
};
