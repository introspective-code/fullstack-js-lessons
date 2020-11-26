const express = require('express');
require('dotenv').config();

const app = express();

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`This is my API KEY: ${API_KEY}`);
});
