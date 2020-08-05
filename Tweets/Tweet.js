const { text } = require("express");
const { Timestamp } = require("mongodb");

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
}

async function retweet(tweetId, userId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var userCollection = mainApp.database.collection("Users");

  await tweetCollection.findOne({ _id: objectId(tweetId) }, (err, tweet) => {
    if (err) console.log(err);

    if (
      tweet.retweetedUsers.some(
        (userObjectId) => userObjectId.toString() === userId
      )
    ) {
      // already retweet, undo retweet
      tweet.retweetedUsers = tweet.retweetedUsers.filter(
        (value, index, arr) => {
          value.toString() !== userId;
        }
      );
      userCollection.findOne({ _id: objectId(userId) }, (err, user) => {
        if (err) throw err;
        // console.log(`owner of tweet ${tweet.userId}, me: ${userId}`);
        // console.log(tweet.userId.toString() != userId);
        if (tweet.userId.toString() != userId) {
          // My own tweet
          userCollection.updateOne(
            { _id: objectId(userId) },
            {
              $set: {
                tweets: user.tweets.filter(
                  (value) => value.toString() != tweetId
                ),
              },
            }
          );
        }
      });
    } else {
      tweet.retweetedUsers.push(objectId(userId));
      userCollection.findOne({ _id: objectId(userId) }, (err, user) => {
        if (err) throw err;
        if (user.tweets.some((tweetIdOld) => tweetIdOld != tweetId)) {
          // TweetId is not in user.tweets
          user.tweets.push(objectId(tweetId));
          userCollection.updateOne(
            { _id: objectId(userId) },
            { $set: { tweets: user.tweets } }
          );
        }
      });
    }

    tweetCollection.updateOne(
      { _id: objectId(tweetId) },
      {
        $set: {
          retweetedUsers: tweet.retweetedUsers,
          retweetCount: tweet.retweetedUsers.length,
        },
      }
    );
  });
}
async function like(tweetId, userId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var userCollection = mainApp.database.collection("Users");

  await tweetCollection.findOne({ _id: objectId(tweetId) }, (err, tweet) => {
    if (err) console.log(err);

    if (
      tweet.likedUsers.some(
        (userObjectId) => userObjectId.toString() === userId
      )
    ) {
      // already liked, undo like
      tweet.likedUsers = tweet.likedUsers.filter((value, index, arr) => {
        value.toString() !== userId;
      });
      userCollection.findOne({ _id: objectId(userId) }, (err, user) => {
        if (err) throw err;
        userCollection.updateOne(
          { _id: objectId(userId) },
          {
            $set: {
              likes: user.likes.filter((value, index, arr) => {
                value.toString() !== tweetId;
              }),
            },
          }
        );
      });
    } else {
      tweet.likedUsers.push(objectId(userId));
      userCollection.findOne({ _id: objectId(userId) }, (err, user) => {
        if (err) throw err;
        user.likes.push(objectId(tweetId));
        userCollection.updateOne(
          { _id: objectId(userId) },
          { $set: { likes: user.likes } }
        );
      });
    }

    tweetCollection.updateOne(
      { _id: objectId(tweetId) },
      {
        $set: {
          likedUsers: tweet.likedUsers,
          likeCount: tweet.likedUsers.length,
        },
      }
    );
  });
}

async function createTweet(text, userId) {
  const mainApp = require("../index");
  var date = new Date();

  if (text.length == 0) return;
  var newTweet = {
    text: text,
    userId: objectId(userId),
    sentTime: `${date.getHours()}:${
      (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    } ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    likeCount: 0,
    likedUsers: [],
    retweetCount: 0,
    retweetedUsers: [],
    replies: [],
    replyCount: 0,
  };
  var tweetCollection = mainApp.database.collection("Tweets");

  var userCollection = mainApp.database.collection("Users");
  userCollection.findOne(objectId(userId), async (err, user) => {
    if (err) throw err;
    console.log(user);
    var newId = (await tweetCollection.insertOne(newTweet)).insertedId;
    user.tweets.push(newId);
    userCollection.updateOne(
      { _id: objectId(userId) },
      { $set: { tweets: user.tweets } },
      (err, res) => {
        if (err) throw err;
      }
    );
  });
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

async function getTweet(tweetId, userId) {
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

  tweet["hasLiked"] = tweet.likedUsers.indexOf(userId) == -1 ? false : true;
  tweet["hasRetweeted"] =
    tweet.retweetedUsers.indexOf(userId) == -1 ? false : true;
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
        { projection: { name: 1, username: 1, profilePhoto: 1, _id: 1 } }
      );
    tweet["User"] = User;
  

    tweet["hasLiked"] = tweet.likedUsers.some(
      (userObjectId) => userObjectId.toString() === userId
    )
      ? true
      : false;
    tweet["hasRetweeted"] = tweet.retweetedUsers.some(
      (userObjectId) => userObjectId.toString() === userId
    )
      ? true
      : false;
    tweets.push(tweet);
  }


  return tweets.reverse();
}

async function getTweetsOfUser(wantedUserId, senderUserId) {
  const mainApp = require("../index");
  var tweetCollection = mainApp.database.collection("Tweets");
  var userCollection = mainApp.database.collection("Users");
  var wantedUser = await userCollection.findOne({
    _id: objectId(wantedUserId),
  });
  console.log("inner");
  var wantedTweets = await tweetCollection
    .find({ _id: { $in: wantedUser.tweets } })
    .toArray();
  for (tweet of wantedTweets) {
    if (tweet.userId.toString() !== wantedUserId) {
      var ownerOfTweetUser = await mainApp.database
        .collection("Users")
        .findOne(
          { _id: tweet.userId },
          { projection: { name: 1, username: 1, profilePhoto: 1, _id: 1 } }
        );
      tweet["User"] = ownerOfTweetUser;
    } else {
      tweet["User"] = {
        name: wantedUser.name,
        profilePhoto: wantedUser.profilePhoto,
        username: wantedUser.username,
        _id: wantedUser._id,
      };
    }
    tweet["hasLiked"] = tweet.likedUsers.some(
      (userObjectId) => userObjectId.toString() === senderUserId
    )
      ? true
      : false;
    tweet["hasRetweeted"] = tweet.retweetedUsers.some(
      (userObjectId) => userObjectId.toString() === senderUserId
    )
      ? true
      : false;
  }

  // console.log(wantedTweets);
  console.log("out");
  return { message: "Success", data: wantedTweets.reverse() };
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
  getTweetsOfUser: getTweetsOfUser,
};
