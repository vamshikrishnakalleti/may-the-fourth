require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
let db;

let client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then((client) => {
  db = client.db("maythefourth");
});

const app = express();

app.get("/", async (req, res) => {
  res.json(await db.collection("characters").find().toArray());
});

app.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const character = await db
      .collection("characters")
      .findOne({ _id: Number(req.params.id) });
    console.log(character);
    res.json(character);
  } catch (error) {
    res.json(error);
  }
});

app.listen(3000);
