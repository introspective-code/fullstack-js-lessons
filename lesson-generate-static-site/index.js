const fs = require("fs");
const express = require("express");
const showdown = require("showdown");

const app = express();
const converter = new showdown.Converter();

const PORT = process.env.PORT || 8000;
const MARKDOWN_DELIMITER = "+++";

app.use(express.static(__dirname + "/dist"));

const source = fs.readFileSync("./src/main.md", "utf8");

const [title, css, script, markdown] = source.split(MARKDOWN_DELIMITER);
const body = converter.makeHtml(markdown);

const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style>${css}</style>
  </head>
  <body>
    ${body}
    <script>${script}</script>
  </body>
</html>
`;

fs.writeFileSync("./dist/index.html", template, "utf8");

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on port ${PORT}`);
});
