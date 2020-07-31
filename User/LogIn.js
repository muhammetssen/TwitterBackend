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
    console.log(response[0]._id);
		return {message:'Success',_id:response[0]._id};
}

module.exports = {
	logIn : logIn,
};