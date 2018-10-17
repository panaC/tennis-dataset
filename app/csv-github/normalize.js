const bayes   = require('bayes');

async function getTourName() {
  let arr = [];
  let query = "SELECT DISTINCT \"flashscores\".\"tournamentName\" FROM \"flashscores\"";

  var sql = await models.sequelize.query(query, {raw: true});
  if (sql && sql[0]) {
    sql[0].forEach((el) => {
      arr.push(el.tournamentName);
    });
  }
  return arr;
}

async function getTourNameClassifier(str) {
  var arr = await getTourName();
  const classifier = bayes()

  arr.forEach((el) => {
    classifier.learn(el.toLowerCase(), el);
  });

  classifier.learn("queen's club", "London")

  var result = classifier.categorize(str.toLowerCase());
  return result;
}

module.export.getTourNameClassifier = getTourNameClassifier();
// Main entry
if (typeof require != 'undefined' && require.main == module) {
  console.log("Main fct normalize.js");
}
