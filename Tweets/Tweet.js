const { text } = require("express");
const { Timestamp } = require("mongodb");

const objectId = require("mongodb").ObjectID;
class Tweet {
  constructor(text, senderUser, sentTime) {
    this.text = text, 
    this.senderUser = senderUser;
    this.sentTime = sentTime;
    this.likeCount = 0;
    this.likedUsers = [];
    this.retweetCount = 0;
    this.retweetedUsers = [];
  }

}

async function retweet(tweetId, userId) {
  const mainApp = require("../index");
  // var userCollection = mainApp.database.collection("Users");
  var tweetCollection = mainApp.database.collection("Tweets");
  var retweetedTweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  var retweetedUsers = retweetedTweet["retweetedUsers"];
  if(retweetedUsers.indexOf(userId) != -1) {
    retweetedUsers = retweetedUsers.filter(function(value, index, arr) {return value != userId});
  }
  else retweetedUsers.push(userId);
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

  if(likedUsers.indexOf(userId) != -1) {
    likedUsers = likedUsers.filter(function(value, index, arr) {return value != userId});
    console.log("removed");
  }
  else likedUsers.push(userId);
 
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

async function createTweet(text, userId) {
  const mainApp = require("../index");
  var date = new Date();

  if(text.length ==0) return;
  var newTweet = {
    text: text,
    userId: objectId(userId),
    sentTime: `${date.getHours()}:${date.getMinutes()} ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    likeCount: 0,
    likedUsers: [],
    retweetCount: 0,
    retweetedUsers: [],
    replies: [],
    replyCount: 0,
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

async function getTweet(tweetId,userId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var tweet = await tweetCollection.findOne({
    _id: objectId(tweetId),
  });
  var User = await mainApp.database
      .collection("Users")
      .findOne(
        { _id: objectId(tweet["userId"]) },
        { name: 1, username: 1, profilePhoto: 1 }
      );
    // console.log({'username':User.username,'name':User.name,'profilePhoto':User.profilePhoto});
    tweet["User"] = {
      username: User.username,
      name: User.name,
      profilePhoto: User.profilePhoto,
    };
   
    tweet['hasLiked'] = tweet.likedUsers.indexOf(userId) == -1 ? false :true;
    tweet['hasRetweeted'] = tweet.retweetedUsers.indexOf(userId) == -1 ? false :true;
    // TODO return responses
  return tweet;
}

async function getAllTweets(userId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var tweets = [];
  var response = await tweetCollection.find({}).toArray();
  for (tweet of response) {
    var User = await mainApp.database
      .collection("Users")
      .findOne(
        { _id: objectId(tweet["userId"]) },
        { name: 1, username: 1, profilePhoto: 1 }
      );
    // console.log({'username':User.username,'name':User.name,'profilePhoto':User.profilePhoto});
    tweet["User"] = {
      username: User.username,
      name: User.name,
      profilePhoto: User.profilePhoto,
    };
   
    tweet['hasLiked'] = tweet.likedUsers.indexOf(userId) == -1 ? false :true;
    tweet['hasRetweeted'] = tweet.retweetedUsers.indexOf(userId) == -1 ? false :true;
    tweets.push(tweet);
  }

  // console.log(tweet.length);
  return tweets.reverse();
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
