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
var uploadImage = require("./Image/uploadImage");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
var editProfile = require("./User/editProfile");
var userMethods = require("./User/UserMethods");
const cors = require("cors");
app.use(cors());
app.use(express.static('public'))

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
  res.json(status);
});

app.post("/logIn", async (req, res) => {
  var status = await logIn.logIn(req);
  res.json( status);
});

app.post("/rttweet", async (req, res) => {
  tweets.retweet(req.body.tweetId,req.body.userId );

  res.json({});
});

app.post("/liketweet", async (req, res) => {
  tweets.like(req.body.tweetId,req.body.userId );
  res.json({});
});

app.post("/setProfilePhoto", async (req, res) =>{
  var path = 'cache/images/profilePhotos';
  var fileName = await uploadImage.uploadImage(req.body.userId,req.body.image,path);
  var host = req.get('host');
  editProfile.setProfilePhoto(req.body.userId,fileName,host);
  res.json();
  // res.send(200);
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
  var response = await tweets.getTweet(req.body.tweetId,req.body.userId);
  res.json({ tweet: response });
});

app.post("/getAllTweets", async (req, res) => {
  var response = await tweets.getAllTweets(req.body.userId);
  res.json({ message: response });
});

app.post("/createTweet", (req, res) => {
  tweets.createTweet(req.body.full_text, req.body._id);
  res.json({});
});
app.post('/getUser', async (req, res) => {
  var response = await userMethods.getUser(req.body.userId);
  res.json(response);

});
app.listen(8080, () => {
  console.log("Listening on 8080");
});

module.exports = {
  database: database,
};
