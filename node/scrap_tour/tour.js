const config      = require(__dirname + '/../config/config.js')["setting"];
const ftour       = require('./tour_evaluate.js');
const match       = require('./../scrap_match/match');
const player      = require('./../scrap_player/player');
const browser     = require('./../tools/browser.js');
const models      = require('./../models');
const dbTools     = require('./../tools/db_tools');
const weather     = require('./../scrap_weather/weather');

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

  try {
    var page = await browser.browser(tournamentUrl + 'archive/');
    const linkYears = await page.evaluate(ftour.linkYears);
    await page.close();

    // While on each tournament archive per year
    for (let j in linkYears) {
      if (linkYears[j]) {
        var year = linkYears[j][1];
        var linkTour = linkYears[j][0];

        // Get Resultat table only
        var page = await browser.browser(linkTour + 'results/');
        tourYear = await page.evaluate(ftour.tourYears);
        await page.close();

        // Scrap all data on each match ID
        for (let k in tourYear) {
          // loop on match by competition on tournament (ex: qualification or not)
          for (let kk in tourYear[k].match) {
            var flashscoreId = tourYear[k].match[kk].id;
            var matchUrl = config.match + flashscoreId;
            // create new line Table HEAD and flashscore
            // All the data is available at this point

            try {
              var db_head = await models.head.findOne({
                where: {
                  flashscoreId: flashscoreId
                }
              });

              if (db_head == null || db_head.dataValues.stateFlashscore != "ok") {
                try {
                  // scraping match
                  //var page = await browser.browser("about:blank");
                  var jsonMatch = await match.getMatch(null, flashscoreId);

                  if (jsonMatch.state == "ERROR") {
                    throw "JsonMatch is unvalid : " + jsonMatch.error;
                  }

                  var idHome = jsonMatch.player.home.playerID;
                  var UrlHome = config.rootUrl + jsonMatch.player.home.playerURL;
                  var home = await player.getPlayer(null, UrlHome, idHome, jsonMatch.player.home.playerCountry);
                  var idAway = jsonMatch.player.away.playerID;
                  var UrlAway = config.rootUrl + jsonMatch.player.away.playerURL;
                  var away = await player.getPlayer(null, UrlAway, idAway, jsonMatch.player.away.playerCountry);
                  if (home.state != "ok") {
                    throw "getPlayer Home is unvalid :" + idHome + ": " + home.error
                  } else if (away.state != "ok") {
                    throw "getPlayer Away is unvalid :" + idAway + ": " + away.error
                  }

                  //await page.close();

                  var date = Date.UTC(year, tourYear[k].match[kk].month,
                    tourYear[k].match[kk].day,
                    tourYear[k].match[kk].hour,
                    tourYear[k].match[kk].min);

                    var jsonWeather = await weather.setWeather(tournamentName,
                      tourYear[k].country, date);
                      if (jsonWeather.state == "ERROR") {
                        throw "setWeather is unvalid " + weather.error;
                      }

                      //Update or Create in flashscore table
                      await dbTools.upsert("flashscore", {
                        state: "ok",
                        matchUrl: matchUrl,
                        tournamentUrl: tournamentUrl,
                        flashscoreId: flashscoreId,
                        tournamentName: tournamentName,
                        round: tourYear[k].match[kk].round,
                        qualification: tourYear[k].qualification,
                        indoor: tourYear[k].indoor,
                        country: tourYear[k].country,
                        surface: tourYear[k].surface,
                        year: year,
                        dateTime: date,
                        data: jsonMatch,
                      }, {
                        flashscoreId: flashscoreId
                      });
                    } catch(e) {
                      try {
                        await page.close();
                      } catch(e) {}
                      res[flashscoreId] = e;
                      console.error("ERROR tour.js", e);
                      continue;
                    }
                    //Update or Create in head table
                    await dbTools.upsert("head", {
                      flashscoreId: flashscoreId,
                      homeId: idHome,
                      stateHome: "ok",
                      awayId: idAway,
                      stateAway: "ok",
                      stateFlashscore: "ok",
                      weatherId: jsonWeather.hash,
                      stateWeather: "ok"
                    }, {
                      flashscoreId: flashscoreId
                    })
                  } // IF db_head doesn't exist
                } catch(e) {

                  res[flashscoreId] = e;
                  console.error("ERROR tour.js", e);
                }
              }
            }
          } // while years
        } // while years
  } catch(e) {
    res.error = e;
    console.error("ERROR tour.js in", tournamentName, e);
  }

  //await browser.close();
  //await models.sequelize.close();

  return res;
}

module.exports.getTour = getTour;

if (typeof require != 'undefined' && require.main == module) {
  getTour(process.argv[2] || "acapulco", process.argv[3] || "https://www.flashscore.com/tennis/atp-singles/acapulco/")
      .then(data => {
        console.log(data);
        //models.sequelize.close();
      });
}
