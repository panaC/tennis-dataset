const config  = require(__dirname + '/config/config.js')["setting"];
const models  = require('./models');
const exec    = require('child-process-promise').exec;
const neatCsv = require('neat-csv');
const fse     = require('fs-extra');

(async () => {
  try {
    if (await fse.pathExists("csv-data")) {
      await exec("cd " + config.csv_dir + " && git pull");
    } else {
      await exec("git clone " + config.csv_git + " && cd csv-data");
    }
  } catch(e) {
    console.error("EROR: index.js", e);
  }
})();
