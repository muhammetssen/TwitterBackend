async function isValid(req) {
  const mainApp = require("../index");
  var collection = mainApp.database.collection("Users");
  var User = {
    name: req.body.name,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    username: req.body.username,
    password: req.body.password,
    profilePhoto : "",
  };
  response = await collection
    .find({ $or: [{ username: User.username }, { email: User.email }] })
    .toArray();

	if (response.length != 0) {
    if (response[0].username == User.username) {
      return {message:"Username has already been taken"};
    } else {
      return {message:"Email has already taken."};
    }
  }
  // console.log(`${User.username} is valid`);
  var response = await collection.insertOne(User);
  return {message:'Success',_id:response.insertedId};
}
module.exports = {
  createUser: isValid,
};
