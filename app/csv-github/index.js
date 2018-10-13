const config  = require(__dirname + '/config/config.js')["setting"];
const models  = require('./models');
const exec    = require('child-process-promise').exec;
const neatCsv = require('neat-csv');
const fs      = require('fs-extra');
const crypto  = require('crypto');
const tools   = require('./tools/db_tools');


(async () => {
  try {
    if (await fs.pathExists(config.csv_dir)) {
      await exec("cd " + config.csv_dir + " && git pull");
    } else {
      await exec("git clone " + config.csv_git + " && cd csv-data");
    }
    try {
      var files = await fs.readdir(config.csv_dir);
      for(i in files) {
        //var rg = /atp_matches_(200[1-9]|201[0-9]|202[0-9]).csv/.exec(files[i]);
        var rg = /^atp_matches_(200[1-9]|201[0-9]|202[0-9]).csv$/.exec(files[i]);
        if (rg) {
          filename = config.csv_dir + "/" + rg[0];
          year = rg[1];
          console.log("filename", filename, "year", year);
          var res = await neatCsv(fs.createReadStream(filename));
          for (j in res) {
            if (res[j] && res[j]["loser_name"] && res[j]["tourney_name"] && res[j]["winner_name"]) {
              var query = "SELECT \"heads\".\"id\" FROM \"heads\" \
              INNER JOIN \"flashscores\" ON \"flashscores\".\"flashscoreId\" = \"heads\".\"flashscoreId\" \
              INNER JOIN \"players\" AS home ON home.\"playerId\" = \"heads\".\"homeId\" \
              INNER JOIN \"players\" AS away ON away.\"playerId\" = \"heads\".\"awayId\" WHERE \
              \"flashscores\".\"tournamentName\" = \'" + res[j]["tourney_name"] + "\' AND \
              \"flashscores\".year = \'2018\' AND \
              ((home.\"fullName\" ILIKE \'" + res[j]["winner_name"].replace(' ', '_') + "\' \
              AND away.\"fullName\" ILIKE \'" + res[j]["loser_name"].replace(' ', '_') + "\') OR \
              (away.\"fullName\" ILIKE \'" + res[j]["winner_name"].replace(' ', '_') + "\' \
              AND home.\"fullName\" ILIKE \'" + res[j]["loser_name"].replace(' ', '_') + "\')) \
              LIMIT 1";
              var db = await models.sequelize.query(query, {raw: true});
              if (db[0][0]) {
                var id = db[0][0].id;
                var hash = crypto.createHash('md5').update(
                  res[j]["tourney_name"] + res[j]["winner_id"] + res[j]["loser_id"]).digest("hex");
                res[j]["hashId"] = hash;
                console.log(id);
                try {
                  tools.upsert("csv", res[j], {"hashId" : hash});

                } catch(e) {
                  console.error("ERROR: csv create line", e);
                }
                try {
                  var query = "UPDATE \"heads\" \
                  SET \"atpWorldTourId\" = \'" + hash + "\', \"stateAtpWorldTour\" = \'ok\' \
                  WHERE \"heads\".\"id\" = \'" + id + "\'";
                  await models.sequelize.query(query, {raw: true});
                } catch(e) {
                  console.error("ERROR: head update line", e);
                }
              }
            } else {
              console.log("bad csv line", res);
            }
          }
        }
      }
    } catch(e) {
      console.error("ERROR: index,js", e);
    }
  } catch(e) {
    console.error("ERROR: repo clone", e);
  }

})();
