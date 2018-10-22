const bayes   = require('bayes');
const models  = require('./models');
const assert  = require('assert');


class getPlayerName {
  constructor (async_param, classifier) {
    if (typeof async_param === 'undefined') {
        throw new Error('Cannot be called directly');
    } else {
      this.classifier = classifier;
    }
  };

  static async build() {
    var classifier = bayes()

    let query = "SELECT DISTINCT \"players\".\"fullName\" FROM \"players\"";

    var sql = await models.sequelize.query(query, {raw: true});
    if (sql && sql[0]) {
      sql[0].forEach((el) => {
        classifier.learn(el.fullName.toLowerCase(), el.fullName);
      });
    } else {
      throw "ERROR: build class getPlayerName, sql error";
    }

    return new getPlayerName(sql, classifier);
  };

  playerName(str) {
    return this.classifier.categorize(str.toLowerCase());
  }
}

function assertPlayer(gtn, csv, flash) {
  try {
    console.log(gtn.playerName(csv.toLowerCase()), flash);
    assert.strictEqual(gtn.tourName(csv.toLowerCase()), flash);
  } catch(e) {
    console.error(/*"\x1b[47m\x1b[31m",*/ "assert fail",
    e.actual, "!=", e.expected, /*"\x1b[0m",*/ "for", csv);
  }
}

module.exports = getPlayerName;
// Main entry
if (typeof require != 'undefined' && require.main == module) {
  console.log("Main fct players.js");

  getPlayerName.build().then((gtn) => {

    assertPlayer(gtn, "Alex Obrien", "Alex O'Brien")
    assertPlayer(gtn, "David Sanchez", "David Sanchez-Munoz")
    assertPlayer(gtn, "Ladislav Svarc", "Ladislav Svarc")
    assertPlayer(gtn, "Rainer Schuettler", "Rainer Schuttler")
    assertPlayer(gtn, "Jose Luis Diaz", "Jose Luis Diaz");

    models.sequelize.close();
  })
}
