const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/config/config.js')["setting"];
const tour        = require('./scrap_tour/tour.js');
const jsonTools   = require('./tools/json_tools');
const ftour       = require('./scrap_tour/tour_evaluate')
const timestamp   = Date.now();
const filename    = __dirname + '/log.json';
const models      = require('./models');

let json = {};

process.on('SIGINT', () => {
  jsonTools.writeJson(filename, json);
});


// Script for scraping all the datas into flashscore.com
// Main entry of 3 JS script file
// Flashscore.js -> tournament scraping
//    tour.js -> Tour Year scraping
//    match.js -> Match scraping
//
// All the dataset is saved both Head and Flashscore DB Table
// For the log Error is saved into the filename File in Json Format
// This script can be started more than one time for saved into DB

 async function flashscore () {
  // Create jsondb Object
  json = await jsonTools.readJson(filename); // read Json FIle;
  json[timestamp] = {};

  // Lauch browser headless
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Start URL
  await page.goto(config.topUrl);
  await page.setViewport(config.dim_screen);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  try {
    // GET all tournament URL
    const tourUrl = await page.evaluate(ftour.tourUrl)

    // While on each tournament
    for (let i in tourUrl) {
      var tournamentName = tourUrl[i][1];
      var tournamentUrl = tourUrl[i][0];
      console.log("=> " + tournamentName);
      var res = await tour.getTour(tournamentName, tournamentUrl);
      if (Object.keys(res).length) {
        json[timestamp][tournamentName] = res;
        console.error("ERROR " + tournamentName + ": ", res);
      }
    }
  } catch(e) {
    json[timestamp].error = e.toString();
    console.error("ERROR: flashscore.js", e);
  } finally {

  }

  await browser.close();
  await jsonTools.writeJson(filename, json);
}

module.exports.flashscore = flashscore;

// Main entry
if (typeof require != 'undefined' && require.main == module) {
  flashscore().then(() => {
    models.sequelize.close();
  }).catch(() => {
    models.sequelize.close();
  });
}
