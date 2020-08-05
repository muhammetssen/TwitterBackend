const objectId = require("mongodb").ObjectID;

async function getUser(userId){
    console.log(`Wanted ID ${userId}`);
    const mainApp = require("../index");
    var collection = mainApp.database.collection('Users');

    var user = await collection.findOne({_id: objectId(userId)});
    if(user) return {message:"Success",user:user};
    else return {'message':"Couldn't find"}
} 
module.exports = {getUser: getUser};