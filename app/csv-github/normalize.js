const bayes   = require('bayes');
const models  = require('./models');
const assert  = require('assert');


class getTourName {
  constructor (async_param, classifier) {
    if (typeof async_param === 'undefined') {
        throw new Error('Cannot be called directly');
    } else {
      this.classifier = classifier;
    }
  };

  static async build() {
    var classifier = bayes()

    let query = "SELECT DISTINCT \"flashscores\".\"tournamentName\" FROM \"flashscores\"";

    var sql = await models.sequelize.query(query, {raw: true});
    if (sql && sql[0]) {
      sql[0].forEach((el) => {
        classifier.learn(el.tournamentName.toLowerCase(), el.tournamentName);
      });
    } else {
      throw "ERROR: build class getTourName, sql error";
    }

    classifier.learn("queen's club", "London")
    return new getTourName(sql, classifier);
  };

  tourName(str) {
    return this.classifier.categorize(str.toLowerCase());
  }
}

module.exports = getTourName;
// Main entry
if (typeof require != 'undefined' && require.main == module) {
  console.log("Main fct normalize.js");

  getTourName.build().then((gtn) => {
    console.log(gtn.tourName("queen's club"));
    assert.strictEqual(gtn.tourName("queen's club"), "London")
    console.log(gtn.tourName("acapulco"));
    assert.strictEqual(gtn.tourName("acapulco"), "Acapulco")

    models.sequelize.close();
  })
}
