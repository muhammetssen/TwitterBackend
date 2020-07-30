const { text } = require("express");

const objectId = require("mongodb").ObjectID;
class Tweet {
  constructor(text, senderUser, sentTime) {
    (this.text = text), (this.senderUser = senderUser);
    this.sentTime = sentTime;
    this.likeCount = 0;
    this.likedUsers = [];
    this.retweetCount = 0;
    this.retweetedUsers = [];
  }

  like(userId) {
    this.likeCount += 1;
    this.likedUsers.push(userId);
  }
}

async function retweet(tweetId, userId) {
  const mainApp = require("../index");
  // var userCollection = mainApp.database.collection("Users");
  var tweetCollection = mainApp.database.collection("Tweets");
  var retweetedTweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  // var retweetedUser = await userCollection.findOne({ _id: objectId(userId) });

  var retweetedUsers = retweetedTweet["retweetedUsers"];

  var retweetedUser = objectId(userId);

  for (let i = 0; i < retweetedUsers.length; i++) {
    const element = retweetedUsers[i];
    if (element.equals(retweetedUser)) {
      return;
    }
  }
  retweetedUsers.push(retweetedUser);
  var newvalues = {
    $set: {
      retweetedUsers: retweetedUsers,
      retweetCount: retweetedUsers.length,
    },
  };
  tweetCollection.updateOne(
    { _id: objectId(tweetId) },
    newvalues,
    (err, res) => {
      if (err) throw err;
    }
  );
  // retweetedUsers['retweetedTweets'].push
  // console.log(retweetedUser);
}
async function like(tweetId, userId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var likedTweet = await tweetCollection.findOne({ _id: objectId(tweetId) });

  var likedUsers = likedTweet["likedUsers"];

  var likedUser = objectId(userId);

  console.log(likedUsers);
  for (let i = 0; i < likedUsers.length; i++) {
    const element = likedUsers[i];
    if (element.equals(likedUser)) {
      return;
    }
    // console.log('asdad');
  }
  likedUsers.push(likedUser);
  var newvalues = {
    $set: { likedUsers: likedUsers, likeCount: likedUsers.length },
  };
  tweetCollection.updateOne(
    { _id: objectId(tweetId) },
    newvalues,
    (err, res) => {
      if (err) throw err;
    }
  );
}

async function createTweet(text, userId, sentTime) {
  const mainApp = require("../index");
  var newTweet = {
    text: text,
    userId: objectId(userId),
    sentTime: sentTime,
    likeCount: 0,
    likedUsers: [],
    retweetCount: 0,
    retweetedUsers: [],
    replies : [],
    replyCount : 0,
  };
  var tweetCollection = mainApp.database.collection("Tweets");
  await tweetCollection.insertOne(newTweet);
}

async function getRetweetCount(tweetId) {
  const mainApp = require("../index");
  // var userCollection = mainApp.database.collection("Users");
  var tweetCollection = mainApp.database.collection("Tweets");
  var retweetedTweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  return retweetedTweet["retweetCount"];
}

async function getLikedCount(tweetId) {
  const mainApp = require("../index");
  // var userCollection = mainApp.database.collection("Users");
  var tweetCollection = mainApp.database.collection("Tweets");
  var likedTweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  return likedTweet["likeCount"];
}

async function getTweet(tweetId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var tweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  return tweet;
}

async function getAllTweets() {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var tweet = await tweetCollection.find({}).toArray();
  // console.log(tweet.length);
  return tweet
  
}

module.exports = {
  createTweet: createTweet,
  Tweet: Tweet,
  retweet: retweet,
  like: like,
  getRetweetCount: getRetweetCount,
  getLikedCount: getLikedCount,
  getTweet: getTweet,
  getAllTweets: getAllTweets,
};
