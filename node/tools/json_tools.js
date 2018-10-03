module.exports.writeJson = function writeJson(filename, json) {
  fs.writeFile(filename, json, 'utf8', (err) => {
    console.log("=== ERROR WriteJson ===");
    console.log(err);
  });
}

module.exports.readJson = function readJson(filename) {
  var json = {};

  return new Promise(resolve => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err && err.errno != -2) {
        if (err){
          console.log("=== ERROR readJson ===");
          console.log(err);
        } else {
          console.log("Parse Json File");
          json = JSON.parse(data); //now it an object
        }
      } else {
        console.log("No Json File");
      }
      resolve(json);
    });
  });
}
