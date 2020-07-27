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
var tweets = require("./Tweets/Tweet");
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

app.post("/createAccount", async (req, res) => {
  var status = await createAccount.createUser(req);
  res.json({ message: status });
});

app.post("/logIn", async (req, res) => {
  var status = await logIn.logIn(req);
  res.json({ message: status });
});

app.post("/rttweet", async (req, res) => {
  tweets.retweet("5f1f263b9c62444d844a109b", "5f1f079ee2320d1804ed3b87");
  res.json({});
});

app.post("/liketweet", async (req, res) => {
  tweets.like("5f1f263b9c62444d844a109b", "5f1f0791e2320d2704ed3b87");
  res.json({});
});

app.post("/getRTCount", async (req, res) => {
  var response = await tweets.getRetweetCount(req.body.tweetId);
  res.json({ message: response });
});

app.post("/getLikedCount", async (req, res) => {
  var response = await tweets.getLikedCount(req.body.tweetId);
  res.json({ message: response });
});
app.post("/getTweet", async (req, res) => {
  var response = await tweets.getTweet(req.body.tweetId);
  res.json({ message: response });
});

app.post("/getAllTweets", async (req, res) => {
  var response = await tweets.getAllTweets();
  res.json({ message: response });
});

app.post("/createTweet", (req, res) => {
  tweets.createTweet("First Tweet", "5f1f07a0e3320d2804ed3b88", "today");
  res.json({});
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});

module.exports = {
  database: database,
};
