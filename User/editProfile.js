const objectId = require("mongodb").ObjectID;


async function setProfilePhoto(userId,imagePath,host) {
    const mainApp = require("../index");
    var collection = mainApp.database.collection('Users');
    // console.log(host+'/'+imagePath);
    // console.log(collection.findOne({}));
    collection.updateOne({_id:objectId(userId)},{$set :{profilePhoto:'http://'+host+'/'+imagePath}},(err, res) => {
        if (err) console.log(err);
    });


}

module.exports = {setProfilePhoto: setProfilePhoto}