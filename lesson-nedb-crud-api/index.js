const express = require('express');
const nedb = require('nedb');

const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || 'data.db';

const db = new nedb({ filename: DB_PATH, autoload: true });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create
app.post('/api/inventory', (req, res) => {
  const { type, quality, color } = req.body;

  const item = {
    type,
    quality,
    color
  };

  db.insert(item, (err, result) => {
    if (err) {
      res.status(500).send('Internal server error.');
    } else {
      res.json(result);
    }
  });
});

// Read (All)
app.get('/api/inventory', (req, res) => {
  db.find({}, (err, results) => {
    if (err) {
      res.status(500).send('Internal server error.');
    } else {
      res.json(results);
    }
  });
});

// Read
app.get('/api/inventory/:id', (req, res) => {
  const query = {
    _id: req.params.id
  };

  db.findOne(query, (err, result) => {
    if (err) {
      res.status(500).send('Internal server error.');
    } else {
      res.json(result);
    }
  });
});

// Update
app.patch('/api/inventory/:id', (req, res) => {
  const query = {
    _id: req.params.id
  };

  const set = {};

  const { type, quality, color } = req.body;

  if (type) {
    set.type = type;
  }

  if (quality) {
    set.quality = quality;
  }

  if (color) {
    set.color = color;
  }

  const update = {
    $set: set
  };

  const options = {};

  db.update(query, update, options, (err, result) => {
    if (err) {
      res.status(500).send('Internal server error.');
    } else {
      res.json(result);
    }
  });
});

// Destroy
app.delete('/api/inventory/:id', (req, res) => {
  const query = {
    _id: req.params.id
  };

  const options = {};

  db.remove(query, options, (err, result) => {
    if (err) {
      res.status(500).send('Internal server error.');
    } else {
      res.json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on port ${PORT}`);
});
