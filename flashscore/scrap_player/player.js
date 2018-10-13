const browser     = require('./../tools/browser.js');
const config      = require(__dirname + '/../config/config.js')["setting"];
const models      = require('./../models');
const evaluate    = require('./player_evaluate');
const dbTools     = require('./../tools/db_tools');

async function getPlayer(page, linkPlayer, idPlayer, countryPlayer) {
  var res = {};
  res.state = "ok";

  var p = true;
  if (!page) {
    var page = await browser.browser(linkPlayer);
  } else {
    await page.goto(linkPlayer);
    await page.waitFor(config.delay_waitForG); // wait for stabilization
  }

  try {
    //findOne if exist idPlayer
    var db_player = await models.player.findOne({
      where: {
        playerId: idPlayer
      }
    });
    if (db_player == null) {
      var player = await page.evaluate(evaluate.player);

      // create line in db player table
      await dbTools.upsert("player", {
        state: "ok",
        playerId: idPlayer,
        playerUrl: linkPlayer,
        fullName: player.fullName,
        age: player.age_timestamp,
        country: countryPlayer
      }, {
        playerId: idPlayer
      });
    }
  } catch(e) {
    res.state = "ERROR";
    res.error = e;
    console.error("ERROR tour.js", e);
  }

  if (p) {
    await page.close();
  }
  //await models.sequelize.close();

  return res;
}

module.exports.getPlayer = getPlayer;

if (typeof require != 'undefined' && require.main == module) {
  getPlayer(process.argv[2] || "https://www.flashscore.com/player/anderson-kevin/2Nq3ecTS/",
      process.argv[3] ||  "2Nq3ecTS", process.argv[4] || "Rsa")
      .then(data => {
        console.log(data);
        models.sequelize.close();
      });

}
