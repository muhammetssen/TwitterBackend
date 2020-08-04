// const { Db } = require("mongodb");
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

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const cors = require("cors");
app.use(cors());

app.use(express.static("public"));

app.use(express.json());


var tweetRoute = require("./Tweets/TweetRoute");
app.use('/tweet',tweetRoute);

var userRoute = require("./User/UserRoute");
app.use("/user", userRoute);





app.listen(8080, () => {
  console.log("Listening on 8080");
});

module.exports = {
  database: database,
};
