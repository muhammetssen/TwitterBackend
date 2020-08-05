var express = require("express");
var router = express.Router();

var userMethods = require("./UserMethods");
var editProfile = require("./editProfile");
var createAccount = require("./createAccount");
var logIn = require("./LogIn");
var uploadImage = require("../Image/uploadImage");
router.use(function timeLog (req, res, next) {
    console.log(req.url);
    next()
  })

router.post("/createAccount", async (req, res) => {
  var status = await createAccount.createUser(req);
  res.json(status);
});



router.post("/logIn", async (req, res) => {
  var status = await logIn.logIn(req);
  res.json(status);
});
router.post("/setProfilePhoto", async (req, res) => {
  var path = "cache/images/profilePhotos";
  var fileName = await uploadImage.uploadImage(
    req.body.userId,
    req.body.image,
    path
  );
  var host = req.get("host");
  editProfile.setProfilePhoto(req.body.userId, fileName, host);
  res.json();
  // res.send(200);
});
router.post("/getUser", async (req, res) => {
  var response = await userMethods.getUser(req.body.userId);
  res.json(response);
});

module.exports = router;