require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");

// Connect MongoDB

let db;

let client = new MongoClient("mongodb+srv://doadmin:show-password@db-mongodb-cluster-ccb57648.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then((client) => {
  db = client.db("maythefourth");
});

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.json(await db.collection("characters").find().toArray());
});

app.get("/winner", async (req, res) => {
  try {
    console.log(req.query);
    const data = await db
      .collection("characters")
      .updateOne({ _id: Number(req.query.id) }, { $inc: { wins: 1 } });
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

app.get("/battle", async (req, res) => {
  try {
    const data = await db.collection("characters").find().toArray();

    const one = getCharacter(1, data.length);
    const two = getCharacter(1, data.length);

    res.render("battle", { one: data[one], two: data[two] });
  } catch (error) {
    res.json(error);
  }
});

app.get("/:id", async (req, res) => {
  const character = await db
    .collection("characters")
    .findOne({ _id: Number(req.params.id) });
  res.render("character", { character });
});

app.listen(8080);

function getCharacter(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
