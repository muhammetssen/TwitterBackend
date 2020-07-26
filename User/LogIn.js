async function logIn(req) {
  const mainApp = require("../index");
  var collection = mainApp.database.collection("Users");
  var credentials = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  response = await collection
    .find({
      $or: [{ username: credentials.username }, { email: credentials.email }],
    })
		.toArray();
		if(response.length == 0){
			return "User not found.";
		}
		if(response[0].password != credentials.password){
			return "Invalid password.";
		}
		return 'Success';
}

module.exports = {
	logIn : logIn,
};