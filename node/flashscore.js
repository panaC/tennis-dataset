const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/config/config.js')["setting"];
const tour        = require('./scrap_tour/tour.js');
const jsonTools   = require('./../tools/json_tool');
const timestamp   = Date.now();
const filename    = __dirname + '/log.json';

// Script for scraping all the datas into flashscore.com
// Main entry of 3 JS script file
// Flashscore.js -> tournament scraping
//    tour.js -> Tour Year scraping
//    match.js -> Match scraping
//
// All the dataset is saved both Head and Flashscore DB Table
// For the log Error is saved into the filename File in Json Format
// This script can be started more than one time for saved into DB


// Create jsondb Object
var json = {};
jsonTools.readJson(filename).then(data => { json = data }); // read Json FIle;
json[timestamp] = {};

(async () => {

  try {
    // Lauch browser headless
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Start URL
    await page.goto(config.topUrl);
    await page.setViewport(config.dim_screen);
    await page.waitFor(config.delay_waitForG); // wait for stabilization

    // GET all tournament URL
    const tourUrl = await page.evaluate(ftour.tourUrl)

    // While on each tournament
    for (let i in tourUrl) {
      var tournamentName = tourUrl[i][1];
      var tournamentUrl = tourUrl[i][0];

      var res = await tour.getTour(tournamentName, tournamentUrl);
      if (Object.keys(res).length) {
        json[timestamp][tournamentName] = res;
      }
    }
    //close App
    await browser.close();
  } catch(e) {
    json[timestamp].error = e;
  }

  await jsonTools.writeJson(filename, json);

})();
