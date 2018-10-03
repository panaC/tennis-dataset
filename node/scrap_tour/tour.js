const config      = require(__dirname + '/../config/config.js')["setting"];
const ftour       = require('./tour_evaluate.js');
const match       = require('./../scrap_match/match')
const puppeteer   = require('puppeteer');
const models      = require('./../models');
const dbTools     = require('./../tools/db_tool');


// Fields  :
/*  - linkTour
    - matchUrl
    - flashscoreId
    - tournamentName
    - tournamentUrl
    - year
    - tourYear[k].qualification
    - tourYear[k].surface
    - tourYear[k].match[kk].round
    - jsonMatch : all the data for match
*/

// Function for scraping the tour data on flashscore
// Param : tournamentName -> The flashscore tournament name
//         tournamentUrl -> The flashscore tournament URL
// Return : state -> OK | ERROR
async function getTour(tournamentName, tournamentUrl) {

  var res = {};

  // Lauch browser headless
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport(config.dim_screen);
  // Get URL per years per tour
  await page.goto(tournamentUrl + 'archive/');

  await page.waitFor(config.delay_waitForG); // wait for stabilization
  const linkYears = await page.evaluate(ftour.linkYears);

  // While on each tournament archive per year
  for (let j in linkYears) {
    if (linkYears[j]) {
      var year = linkYears[j][1];
      var linkTour = linkYears[j][0];
      console.log("==> Tournament:", tournamentName, ", Year:", year);

      // Get Resultat table only
      await page.goto(linkTour + 'results/');

      await page.waitFor(config.delay_waitForG); // wait for stabilization

      //parse each <tr> in table
      tourYear = await page.evaluate(ftour.tourYears);

      // Scrap all data on each match ID
      for (let k in tourYear) {
        // loop on match by competition on tournament (ex: qualification or not)
        for (let kk in tourYear[k].match) {
          var flashscoreId = tourYear[k].match[kk].id;
          var matchUrl = config.match + flashscoreId;
          // create new line Table HEAD and flashscore
          // All the data is available at this point
          // TODO : Add parsing dateTime

          try {
            var db_head = await models.head.findOne({
              where: {
                flashscoreId: flashscoreId
              }
            });

            if (!(db_head && db_head.dataValues.stateFlashscore == "ok")) {
              try {
                // scraping match
                var jsonMatch = await match.getMatch(flashscoreId);
                if (jsonMatch.state == "ERROR") {
                  throw "JsonMatch is unvalid : " + jsonMatch.error;
                }
                //Update or Create in flashscore table
                upsert("flashscore", {
                  state: "ok",
                  matchUrl: matchUrl,
                  tournamentUrl: tournamentUrl,
                  flashscoreId: flashscoreId,
                  tournamentName: tournamentName,
                  round: tourYear[k].match[kk].round,
                  qualification: tourYear[k].qualification,
                  surface: tourYear[k].surface,
                  year: year,
                  data: jsonMatch,
                }, {
                  flashscoreId: flashscoreId
                });
              } catch(e) {
                res[flashscoreId] = e;
                continue;
              }

              if (!db_head || db_head.dataValues.stateFlashscore != "ok") {
                //Update or Create in head table
                upsert("head", {
                  flashscoreId: flashscoreId,
                  stateFlashscore: "ok"
                }, {
                  flashscoreId: flashscoreId
                })
              }
            } // IF db_head doesn't exist
          } catch(e) {
            res[flashscoreId] = e;
          }
        }
      }
    } // while years
  } // while years

  await browser.close();

  return res;
}

module.exports.getTour = getTour;

if (typeof require != 'undefined' && require.main == module) {
  getTour(process.argv[2] || "acapulco", process.argv[3] || "https://www.flashscore.com/tennis/atp-singles/acapulco/")
      .then(data => {
        console.log(data);
      });
}
