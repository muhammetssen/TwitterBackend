const { Db } = require("mongodb");
var database;
console.log("Connecting to DB");
const MongoClient = require("mongodb").MongoClient;
const MongoURL = "mongodb://35.209.140.129:27018/Twitter";
const client = new MongoClient(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client.connect().then((database = client.db("Twitter")));

const express = require("express");
const app = express();
var createAccount = require("./User/createAccount");
var logIn = require("./User/LogIn");
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "meower",
  });
});

app.post("/mews", (req, res) => {
  res.json({ message: "Done" });
});

app.post("/createAccount", async (req, res) =>  {
  var status = await createAccount.createUser(req);
  res.json({ message: status });
});

app.post('/logIn', async (req,res) => {
    var status = await logIn.logIn(req);
    res.json({ message : status});

});


app.listen(8080, () => {
  console.log("Listening on 8080");
});

module.exports = {
  database: database,
};
