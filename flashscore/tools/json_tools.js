const fs    = require('fs');

module.exports.writeJson = function writeJson(filename, json) {
  // fs.writeFile(filename, JSON.stringify(json), 'utf8', (err) => {
  //   if (err) {
  //     console.log("=== ERROR WriteJson ===");
  //     console.log(err);
  //   }
  // });
  fs.writeFileSync(filename, JSON.stringify(json), 'utf8');
}

module.exports.readJson = function readJson(filename) {
  var json = {};

  return new Promise(resolve => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (data) {
        json = JSON.parse(data); //now it an object
      } else {
        console.log("INFO: No Json File");
      }
      resolve(json);
    });
  });
}
