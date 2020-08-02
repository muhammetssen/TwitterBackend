const fs = require("fs");
// objectId = require("mongodb").ObjectID;
const md5 = require("js-md5");

function uploadImage(imageName, image, path) {
  var name = md5(imageName);
  var image = image;
  var realFile = Buffer.from(image, "base64");

  path = path + "/" + name.substring(0, 2);
  fs.mkdir('public/'+path, { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  fs.writeFile('public/'+path+'/'+name,realFile,(err) => {
      if (err) console.log(err);
  })
  return path+'/'+name;
}
module.exports = { uploadImage: uploadImage };
