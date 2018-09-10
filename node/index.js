const puppeteer = require('puppeteer');
const models  = require('./models');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.flashscore.com/tennis/');
  await page.setViewport({width: 1366, height: 768});
  const elements = await page.evaluate(() => {
    let elements = Array.from(document.querySelector("li#lmenu_5724").querySelector("ul.submenu").querySelectorAll("a"));
    let links = elements.map(element => {
      return [element.href, element.innerText ]
    });
    return links;
  })

  for (let i in elements) {
    let tournamentName = elements[i][1];
    // console.log(elements[i][0], elements[i][1]);
    // var event = await models.tournament.create({
    //   flashscoreUrl: elements[i][0],
    //   name: tournamentName
    // });
    // let tournamentId = event.dataValues.id;
    await page.goto(elements[i][0] + 'archive/');
    const linkYears = await page.evaluate(() => {
      let elements = Array.from(document.querySelector(".tournament-page-archiv").querySelectorAll("a"));
      let links = elements.map((element, index) => {
        return (index % 2 == 0 ? element.href : null);
      });
      return links;
    });

    for (let j in linkYears) {
      if (linkYears[j]) {
        await page.goto(linkYears[j] + 'results/');
        const linkMatch = await page.evaluate(() => {
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

        //Scrap uniquement les matchs
        for (let k in linkMatch) {
          for (let kk in linkMatch[k].match) {
            await page.goto("https://www.flashscore.com/match/" + linkMatch[k].match[kk])
          }
        }
      }
    }
  }

  await browser.close();
})();
