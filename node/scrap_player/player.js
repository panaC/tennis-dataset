const config      = require(__dirname + '/../config/config.js')["setting"];
const puppeteer   = require('puppeteer');
const models      = require('./../models');
const evaluate    = require('./player_evaluate');
const dbTools     = require('./../tools/db_tools');

async function getPlayer(linkPlayer, idPlayer, countryPlayer) {
  var res = {};
  res.state = "ok";

  // Lauch browser headless
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(config.dim_screen);
  // Get URL per years per tour
  await page.goto(linkPlayer);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  try {
    //findOne if exist idPlayer
    var db_player = await models.player.findOne({
      where: {
        playerId: idPlayer
      }
    if (db_player == null) {
      var player = await page.evaluate(evaluate.player);

      // create line in db player table
      dbTools.upsert("player", {
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

  await browser.close();
  await models.Sequelize.close()

  return res;
}

module.exports = getPlayer;

if (typeof require != 'undefined' && require.main == module) {

}
