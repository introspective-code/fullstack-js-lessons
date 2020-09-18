const Joi = require("joi");
const express = require("express");
const nedb = require("nedb-async").AsyncNedb;
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || "data.db";

const db = new nedb({ filename: DB_PATH, autoload: true });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

const postSchema = Joi.object({
  type: Joi.string()
    .valid("shirt", "pants", "sweater", "jacket", "socks", "scarf")
    .required(),
  quality: Joi.string().valid("new", "old", "worn").required(),
  color: Joi.string(),
});

const patchSchema = Joi.object({
  type: Joi.string().valid(
    "shirt",
    "pants",
    "sweater",
    "jacket",
    "socks",
    "scarf"
  ),
  quality: Joi.string().valid("new", "old", "worn"),
  color: Joi.string(),
});

const querySchema = Joi.object({
  _id: Joi.string().required(),
});

app.listen(PORT, () => {
  console.log(`[ index.js ] Listening on port ${PORT}`);
});

// Create
app.post("/api/inventory", async (req, res, next) => {
  try {
    const { type, quality, color } = req.body;

    const input = { type, quality, color };

    await postSchema.validateAsync(input);
    const data = await db.asyncInsert(input);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Read (All)
app.get("/api/inventory", async (req, res, next) => {
  try {
    const data = await db.asyncFind({});
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Read
app.get("/api/inventory/:id", async (req, res, next) => {
  const input = {
    _id: req.params.id,
  };

  try {
    await querySchema.validateAsync(input);
    const data = await db.asyncFindOne(input);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Update
app.patch("/api/inventory/:id", async (req, res, next) => {
  const query = {
    _id: req.params.id,
  };

  try {
    const input = req.body;

    const update = {
      $set: input,
    };

    const options = {};

    await querySchema.validateAsync(query);
    await patchSchema.validateAsync(input);
    const count = await db.asyncUpdate(query, update, options);
    res.json({ updated: count });
  } catch (err) {
    next(err);
  }
});

// Destroy
app.delete("/api/inventory/:id", async (req, res, next) => {
  const query = {
    _id: req.params.id,
  };

  const options = {};

  try {
    await querySchema.validateAsync(query);
    const count = await db.asyncRemove(query, options);
    res.json({ removed: count });
  } catch (err) {
    next(err);
  }
});
