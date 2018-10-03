const config      = require(__dirname + '/../config/config.js')["setting"];
const ft          = require('./match_evaluate.js');
const puppeteer   = require('puppeteer');

// Function for scraping the match data on flashscore
// Param : matchId -> The flashscore id for set in the URL
// Return : res -> JSON contain the match data
async function getMatch(matchId) {

  var res = {};

  // Lauch browser headless
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Start URL

  await page.setViewport(config.dim_screen);
  await page.goto(config.match + matchId);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  //get info match
  try {
    var tmpLi;

    res.score = await page.evaluate(ft.score);
    res.player = await page.evaluate(ft.player);

    tmpLi = await page.evaluate(() => {
      detail_tab('statistics');
      return (document.querySelector("li#li-match-statistics") ? true : false )
    })
    if (tmpLi) {
      await page.waitFor(200); // wait for stabilization
      await page.waitForSelector("#tab-match-statistics .ifmenu");
      res.stats = await page.evaluate(ft.stats);
    }

    tmpLi = await page.evaluate(() => {
      detail_tab('odds-comparison');
      return (document.querySelector("li#li-match-odds-comparison") ? true : false )
    })
    if (tmpLi) {
      await page.waitFor(200); // wait for stabilization
      await page.waitForSelector("#tab-match-odds-comparison .ifmenu");
      res.odds = await page.evaluate(ft.odds);
    }

    tmpLi = await page.evaluate(() => {
      detail_tab('match-history');
      return (document.querySelector("li#li-match-history") ? true : false )
    })
    if (tmpLi) {
      await page.waitFor(200); // wait for stabilization
      await page.waitForSelector("#tab-match-history .ifmenu");
      res.point = await page.evaluate(ft.point);
    }
    res.state = "ok"
  } catch (e) {
    FlagError = true;
    console.log("=== ERROR START ===");
    console.log("--> INFO : ", e);
    console.log("--> ID :");
    console.log(matchId);
    console.log("=== ERROR END ===");
    res.state = "ERROR"
    res.error = e
  }

  await browser.close();

  return res;
}

module.exports.getMatch = getMatch;

if (typeof require != 'undefined' && require.main == module) {
    getMatch(process.argv[2] || "Qeuptssd").then(data => {
      console.log(data);
    });
}