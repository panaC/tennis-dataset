const puppeteer = require('puppeteer');
const models  = require('./models');
const ft = require('./match_evaluate.js');
const ftour = require('./tour_evaluate.js');



    // ICI exporter la creation des donnees dans la base a la fin de la generation du json
    // Save le Json dans un fichier a la fin

    // Save on tournament DB TABLE
    // console.log(elements[i][0], elements[i][1]);
    // var event = await models.tournament.create({
    //   flashscoreUrl: elements[i][0],
    //   name: tournamentName
    // });
    // let tournamentId = event.dataValues.id;

let delay_waitFor = 1000;
let FlagError = false;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.flashscore.com/tennis/');
  await page.setViewport({width: 1366, height: 768});

  await page.waitFor(delay_waitFor); // wait for stabilization

  // GET all tournament URL
  const tourUrl = await page.evaluate(ftour.tourUrl)

  // Create jsondb Object
  let jsondb = {};
  jsondb.tournament = {};
  jsondb.date = [];
  jsondb.date.push(Date.now());

  // While on each tournament
  for (let i in tourUrl) {
    let tmpTour = {};
    tmpTour.tournamentName = tourUrl[i][1];
    tmpTour.tournamentUrl = tourUrl[i][0];
    if (jsondb.tournament[tmpTour.tournamentName] && jsondb.tournament[tmpTour.tournamentName].state == "ok") {
      break; //pass already saved
    }
    jsondb.tournament[tmpTour.tournamentName] = {};
    // Get all URL per years
    await page.goto(tmpTour.tournamentUrl + 'archive/');

    await page.waitFor(delay_waitFor); // wait for stabilization
    const linkYears = await page.evaluate(ftour.linkYears);

    // While on each tournament archive per year
    for (let j in linkYears) {
      if (linkYears[j]) {
        let tmpTourYear = {};
        tmpTourYear.year = linkYears[j][1];
        if (jsondb.tournament[tmpTour.tournamentName][tmpTourYear.year] &&
          jsondb.tournament[tmpTour.tournamentName][tmpTourYear.year].state == "ok") {
          break; //pass already saved
        }
        console.log("====> Tournament:", tmpTour.tournamentName, ", Year:", tmpTourYear.year);

        // Get Resultat table only
        await page.goto(linkYears[j][0] + 'results/');

        await page.waitFor(delay_waitFor); // wait for stabilization

        //parse each <tr> in table
        tmpTourYear.tourYear = await page.evaluate(ftour.tourYears);

        // Scrap all data on each match ID
        for (let k in tmpTourYear.tourYear) {
          for (let kk in tmpTourYear.tourYear[k].match) {
            await page.goto("https://www.flashscore.com/match/" + tmpTourYear.tourYear[k].match[kk].id);
            var progression = " , progression " + ((kk + 1) * (k + 1) * (j + 1) * (i + 1)) / (tmpTourYear.tourYear[k].match.length * tmpTourYear.tourYear.length * linkYears.length * tourUrl.length) * 100 + "%";
            console.log("==> get match ID:", tmpTourYear.tourYear[k].match[kk].id, progression);

            await page.waitFor(delay_waitFor); // wait for stabilization

            //get info match
            try {
              var tmpLi;

              tmpTourYear.tourYear[k].match[kk].score = await page.evaluate(ft.score);
              tmpTourYear.tourYear[k].match[kk].player = await page.evaluate(ft.player);

              tmpLi = await page.evaluate(() => {
                detail_tab('statistics');
                return (document.querySelector("li#li-match-statistics") ? true : false )
              })
              if (tmpLi) {
                await page.waitFor(200); // wait for stabilization
                await page.waitForSelector("#tab-match-statistics .ifmenu");
                tmpTourYear.tourYear[k].match[kk].stats = await page.evaluate(ft.stats);
              }

              tmpLi = await page.evaluate(() => {
                detail_tab('odds-comparison');
                return (document.querySelector("li#li-match-odds-comparison") ? true : false )
              })
              if (tmpLi) {
                await page.waitFor(200); // wait for stabilization
                await page.waitForSelector("#tab-match-odds-comparison .ifmenu");
                tmpTourYear.tourYear[k].match[kk].odds = await page.evaluate(ft.odds);
              }

              tmpLi = await page.evaluate(() => {
                detail_tab('match-history');
                return (document.querySelector("li#li-match-history") ? true : false )
              })
              if (tmpLi) {
                await page.waitFor(200); // wait for stabilization
                await page.waitForSelector("#tab-match-history .ifmenu");
                tmpTourYear.tourYear[k].match[kk].point = await page.evaluate(ft.point);
              }
              tmpTourYear.tourYear[k].match[kk].state = "ok"
            } catch (e) {
              FlagError = true;
              console.log("=== ERROR START ===");
              console.log("--> INFO : ", e);
              console.log("--> JSON :");
              console.log(tmpTourYear.tourYear[k].match[kk]);
              console.log("=== ERROR END ===");
              tmpTourYear.tourYear[k].match[kk].state = "ERROR"
              tmpTourYear.tourYear[k].match[kk].error = e
            }
          }
        } // while match
        if (FlagError) {
          tmpTourYear.state = "ok";
        } else {
          //save jsondb into redis
          process.exit();
        }
        jsondb.tournament[tmpTour.tournamentName][tmpTourYear.year] = tmpTourYear;
      } // while years
    } // while years
    jsondb.tournament[tmpTour.tournamentName].state = "ok";
    console.log("=> Progression tournament: ", i / elements.length * 100, "%");
  }

  await browser.close();
})();
