const config  = require(__dirname + '/config/config.js')["setting"];
const models  = require('./models');
const exec    = require('child-process-promise').exec;
const neatCsv = require('neat-csv');
const fs      = require('fs-extra');
const crypto  = require('crypto');
const tools   = require('./tools/db_tools');
const nm      = require('./normalize');
const format  = require('string-format');

format.extend(String.prototype, {});

const sqlInnerJoinQuery = "SELECT \"heads\".\"id\" FROM \"heads\" \
INNER JOIN \"flashscores\" ON \"flashscores\".\"flashscoreId\" = \"heads\".\"flashscoreId\" \
INNER JOIN \"players\" AS home ON home.\"playerId\" = \"heads\".\"homeId\" \
INNER JOIN \"players\" AS away ON away.\"playerId\" = \"heads\".\"awayId\" WHERE \
\"flashscores\".\"tournamentName\" ILIKE \' {0} \' AND \
\"flashscores\".year = \'2018\' AND \
((home.\"fullName\" ILIKE \' {1} \' \
AND away.\"fullName\" ILIKE \' {2} \') OR \
(away.\"fullName\" ILIKE \' {1} \' \
AND home.\"fullName\" ILIKE \'{2} \')) \
LIMIT 1";

const sqlUpdateHeadsQuery = "UPDATE \"heads\" \
SET \"atpWorldTourId\" = \' {0} \', \"stateAtpWorldTour\" = \'ok\' \
WHERE \"heads\".\"id\" = \' {1} \'";

function git() {
  try {
    if (await fs.pathExists(config.csv_dir)) {
      await exec("cd " + config.csv_dir + " && git pull");
    } else {
      await exec("git clone " + config.csv_git + " && cd csv-data");
    }
  } catch(e) {
    console.error("ERROR: repo git", e);
  }
}

(async () => {
  git();

  try {
    var files = await fs.readdir(config.csv_dir);
    for(i in files) {
      //var rg = /atp_matches_(200[1-9]|201[0-9]|202[0-9]).csv/.exec(files[i]);
      var rg = /^atp_matches_(200[1-9]|201[0-9]|202[0-9]).csv$/.exec(files[i]);
      if (rg && rg[1]) {

        filename = config.csv_dir + "/" + rg[0];
        year = rg[1];

        console.log("filename:", filename, "year:", year);

        var res = await neatCsv(fs.createReadStream(filename));
        for (j in res) {

          if (res[j] && res[j]["loser_name"] && res[j]["tourney_name"] && res[j]["winner_name"]) {

            var tourName = nm.getTourNameClassifier(res[j]["tourney_name"]);

            var db = await models.sequelize.query(
              sqlInnerJoinQuery.format(tourName, res[j]["winner_name"].replace(' ', '_'),
              res[j]["loser_name"].replace(' ', '_')
              ), {
                raw: true
            });
            if (db[0][0] && db[0][0].id) {

              var id = db[0][0].id;
              var hash = crypto.createHash('md5').update(
                tourName + res[j]["winner_id"] + res[j]["loser_id"]).digest("hex");
              res[j]["hashId"] = hash;

              console.log("Id find: ", id, "hash:", hash);

              try {
                tools.upsert("csv", res[j], {"hashId" : hash});
              } catch(e) {
                console.error("ERROR: csv create line", e);
              }

              try {
                await models.sequelize.query(sqlUpdateHeadsQuery.format(hash, id), {raw: true});
              } catch(e) {
                console.error("ERROR: head update line", e);
              }

            } else {
              console.log("no query result", res[j]["tourney_name"], "lose:", res[j]["loser_name"], "win:", res[j]["winner_name"]);
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

})();
