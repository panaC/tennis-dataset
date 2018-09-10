const puppeteer = require('puppeteer');
const models  = require('./models');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.flashscore.com/tennis/');
  await page.setViewport({width: 1366, height: 768});

  // GET all tournament URL
  const elements = await page.evaluate(() => {
    let elements = Array.from(document.querySelector("li#lmenu_5724").querySelector("ul.submenu").querySelectorAll("a"));
    let links = elements.map(element => {
      return [ element.href, element.innerText ]
    });
    return links;
  })

  // Create jsondb Object
  let jsondb = {};
  jsondb.dataset = [];
  jsondb.date = Date.now();

  // While on each tournament 
  for (let i in elements) {
    let tmpTour = {};
    tmpTour.tournamentName = elements[i][1];
    tmpTour.tournamentUrl = elements[i][0];
    tmpTour.tour = [];
    
    // ICI exporter la creation des donnees dans la base a la fin de la generation du json
    // Save le Json dans un fichier a la fin

    // Save on tournament DB TABLE
    // console.log(elements[i][0], elements[i][1]);
    // var event = await models.tournament.create({
    //   flashscoreUrl: elements[i][0],
    //   name: tournamentName
    // });
    // let tournamentId = event.dataValues.id;
    
    // Get all URL per years
    await page.goto(elements[i][0] + 'archive/');
    const linkYears = await page.evaluate(() => {
      let elements = Array.from(document.querySelector(".tournament-page-archiv").querySelectorAll("a"));
      let links = elements.map((element, index) => {
        return [ (index % 2 == 0 ? element.href : null),
          /(19[5-9]\d|20[0-4]\d|2050)$/.exec(element.innerText)[0] ];
      });
      return links;
    });

    // While on each tournament archive per year
    for (let j in linkYears) {
      if (linkYears[j][0]) {
        let tmpTourYear = {};
        tmpTourYear.year = linkYears[j][1]; 

        // Get Resultat table only
        await page.goto(linkYears[j] + 'results/');
        
        //parse each <tr> in table
        tmpTourYear.tourYear = await page.evaluate(() => {

          //display all match
          loadMoreGames();
          loadMoreGames();

          var retu = [];
          //Warning querySelectorAll return n+1 cases : n element and the length
          var arrayTable = document.querySelectorAll("table.tennis");
          arrayTable.forEach((atVal) => {
            var tmp = {};
            var roun = "";
            tmp.qualification = atVal.querySelector("thead").innerText.includes("Qualification");
            tmp.surface = atVal.querySelector("thead").innerText.split(', ')[1].slice(0, -1);
            tmp.match = [];
            var arrayTableMatch = atVal.querySelectorAll("tbody tr");
            arrayTableMatch.forEach((atmVal) => {
              if (!atmVal.id) {
                roun = atmVal.innerText;
              } else {
                tmp.match.push({round: roun, id: atmVal.id.split('_')[2]});
              }
            });
            retu.push(tmp);
          });
          return retu;
        });

        // Scrap all data on each match ID
        for (let k in linkMatch) {
          for (let kk in linkMatch[k].match) {
            await page.goto("https://www.flashscore.com/match/" + linkMatch[k].match[kk]);
            await page.evaluate(() => {
              detail_tab('odds-comparison');
              detail_tab('statistics');
              detail_tab('match-history');
            })
          }
        } // while match
        tmpTour.tour.push(tmpTourYear);
      } // while years
    } // while years
    jsondb.dataset.push(tmpTour);
  }

  await browser.close();
})();
