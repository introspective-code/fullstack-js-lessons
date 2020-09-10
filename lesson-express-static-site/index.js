const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`[ index.js ] Serving static site at http://localhost:${PORT}`);
});
