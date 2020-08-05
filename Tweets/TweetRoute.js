var express = require("express");
var router = express.Router();
var tweets = require("./Tweet");

router.use(function timeLog(req, res, next) {
  console.log(req.url);
  next();
});
router.post("/createTweet", (req, res) => {
  tweets.createTweet(req.body.full_text, req.body._id);
  res.json({});
});
router.post("/rttweet", async (req, res) => {
  tweets.retweet(req.body.tweetId, req.body.userId);
  res.json({});
});

router.post("/liketweet", async (req, res) => {
  tweets.like(req.body.tweetId, req.body.userId);
  res.json({});
});

router.post("/getRTCount", async (req, res) => {
  var response = await tweets.getRetweetCount(req.body.tweetId);
  res.json({ message: response });
});

router.post("/getLikedCount", async (req, res) => {
  var response = await tweets.getLikedCount(req.body.tweetId);
  res.json({ message: response });
});

router.post("/getTweet", async (req, res) => {
  var response = await tweets.getTweet(req.body.tweetId, req.body.userId);
  res.json({ tweet: response });
});

router.post("/getTweetsOfUser", async (req, res) => {
  var response =  await tweets.getTweetsOfUser(
    req.body.wantedUserId,
    req.body.senderUserId
  );
  res.json( response );

});
router.post("/getAllTweets", async (req, res) => {
  var response = await tweets.getAllTweets(req.body.userId);
  res.json({ message: response });
});


module.exports = router;
