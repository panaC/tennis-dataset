const scrapeIt    = require("scrape-it");
const date        = require("date-and-time");
const parsePrice  = require('parse-price');
const json        = require('./json_tools');
const filename    = "./dataset_atpworldtour.json"

async function for_tour() {
  let json_tour = {};
  let data = {};
  let url = { url: "", proxy: "http://35.180.86.47:3030"};

  for (let i = 2001; i <= 2018; i++) {
    let year = i.toString();
    url.url = "https://www.atpworldtour.com/en/scores/results-archive?year=" + year;
    console.log("Start new tour", year);
    data = await tour(url, year);
    try {
      json_tour[year] = data.data[year];
      for (let j in json_tour[year]) {
        try {
          url.url = "https://www.atpworldtour.com" + json_tour[year][j].url;
          data = await match(url);
          json_tour[year][j]["match"] = data.data["match"];
          for (let k in json_tour[year][j]["match"]) {
            try {
              url.url = "https://www.atpworldtour.com" + json_tour[year][j]["match"][k].stats_url;
              if (url.url == "https://www.atpworldtour.com") {
                console.log("STATS unknown", json_tour[year][j]["match"][k]);
              } else {
                data = await stats(url);
                json_tour[year][j]["match"][k]["stats"] = data.data["stats"];
              }
            } catch(e) {
              console.error("ERROR: stats", url.url, e);
            }
          }
        } catch(e) {
          console.error("ERROR: match", url.url, e);
        }
      }
    } catch(e) {
      console.error("ERROR: tour", url.url, e);
    }
  }
  return json_tour;
}

async function tour(url, year) {
  return await scrapeIt(url, {
    [year]: {
      listItem: "div#scoresResultsArchive tbody tr",
      data: {
        name: {
          selector: "span.tourney-title",
          trim: true
        },
        location: {
          selector: "span.tourney-location",
          trim: true
        },
        date: {
          selector: "span.tourney-dates",
          trim: true,
          convert: x => new Date(date.parse(x, "YYYY.MM.DD", true))
        },
        door: {
          selector: "td.tourney-details div.item-details",
          trim: true,
          eq: 1,
          convert: x => x.split(" ")[0]
        },
        surface: {
          selector: "td.tourney-details span.item-value",
          trim: true,
          eq: 2
        },
        prize: {
          selector: "td.tourney-details.fin-commit span.item-value",
          trim: true,
          convert: x => parsePrice(x)
        },
        url: {
          selector: "a.button-border",
          attr: "href"
        }
      }
    }
  })
}

async function match(url) {
  return await scrapeIt(url, {
    match: {
      listItem: "div#scoresResultsContent tbody tr",
      data: {
        winner: {
          selector: "td.day-table-name",
          eq: 0,
          trim: true,
        },
        winner_url: {
          selector: "td.day-table-name a",
          eq: 0,
          trim: true,
          attr: "href"
        },
        loser: {
          selector: "td.day-table-name",
          eq: 1,
          trim: true,
        },
        loser_url: {
          selector: "td.day-table-name a",
          eq: 1,
          trim: true,
          attr: "href"
        },
        stats_url: {
          selector: "td.day-table-score a",
          attr: "href"
        }
      }
    }
  })
}

function tr_stat(x) {
  return {
    ptg: x.slice('%')[0],
    over: /\((.*)\/(.*)\)/.exec(x)[1],
    under: /\((.*)\/(.*)\)/.exec(x)[2]
  };
}

async function stats(url) {
  return await scrapeIt(url, {
    stats: {
      selector: "div#playerStatsContainer",
      data: {
        winner_serve_rating: {
          selector: "td.match-stats-number-left",
          eq: 0,
          trim: true
        },
        winner_aces: {
          selector: "td.match-stats-number-left",
          eq: 1,
          trim: true
        },
        winner_first_serve: {
          selector: "td.match-stats-number-left",
          eq: 2,
          trim: true
        },
        winner_first_serve_point_won: {
          selector: "td.match-stats-number-left",
          eq: 3,
          trim: true,
          convert: tr_stat
        },
        winner_second_serve_point_won: {
          selector: "td.match-stats-number-left",
          eq: 4,
          trim: true,
          convert: tr_stat
        },
        winner_bp_saved: {
          selector: "td.match-stats-number-left",
          eq: 5,
          trim: true,
          convert: tr_stat
        },
        winner_service_game_played: {
          selector: "td.match-stats-number-left",
          eq: 6,
          trim: true,
          convert: tr_stat
        },
        winner_return_rating: {
          selector: "td.match-stats-number-left",
          eq: 7,
          trim: true
        },
        winner_first_serve_return_point_won: {
          selector: "td.match-stats-number-left",
          eq: 8,
          trim: true
        },
        winner_second_serve_return_point_won: {
          selector: "td.match-stats-number-left",
          eq: 9,
          trim: true,
          convert: tr_stat
        },
        winner_bp_converted: {
          selector: "td.match-stats-number-left",
          eq: 10,
          trim: true,
          convert: tr_stat
        },
        winner_return_games_played: {
          selector: "td.match-stats-number-left",
          eq: 11,
          trim: true,
          convert: tr_stat
        },
        winner_service_point_won: {
          selector: "td.match-stats-number-left",
          eq: 12,
          trim: true
        },
        winner_return_point_won: {
          selector: "td.match-stats-number-left",
          eq: 13,
          trim: true,
          convert: tr_stat
        },
        winner_total_point_won: {
          selector: "td.match-stats-number-left",
          eq: 14,
          trim: true,
          convert: tr_stat
        },
        loser_serve_rating: {
          selector: "td.match-stats-number-right",
          eq: 0,
          trim: true
        },
        loser_aces: {
          selector: "td.match-stats-number-right",
          eq: 1,
          trim: true
        },
        loser_first_serve: {
          selector: "td.match-stats-number-right",
          eq: 2,
          trim: true
        },
        loser_first_serve_point_won: {
          selector: "td.match-stats-number-right",
          eq: 3,
          trim: true,
          convert: tr_stat
        },
        loser_second_serve_point_won: {
          selector: "td.match-stats-number-right",
          eq: 4,
          trim: true,
          convert: tr_stat
        },
        loser_bp_saved: {
          selector: "td.match-stats-number-right",
          eq: 5,
          trim: true,
          convert: tr_stat
        },
        loser_service_game_played: {
          selector: "td.match-stats-number-right",
          eq: 6,
          trim: true,
          convert: tr_stat
        },
        loser_return_rating: {
          selector: "td.match-stats-number-right",
          eq: 7,
          trim: true
        },
        loser_first_serve_return_point_won: {
          selector: "td.match-stats-number-right",
          eq: 8,
          trim: true
        },
        loser_second_serve_return_point_won: {
          selector: "td.match-stats-number-right",
          eq: 9,
          trim: true,
          convert: tr_stat
        },
        loser_bp_converted: {
          selector: "td.match-stats-number-right",
          eq: 10,
          trim: true,
          convert: tr_stat
        },
        loser_return_games_played: {
          selector: "td.match-stats-number-right",
          eq: 11,
          trim: true,
          convert: tr_stat
        },
        loser_service_point_won: {
          selector: "td.match-stats-number-right",
          eq: 12,
          trim: true
        },
        loser_return_point_won: {
          selector: "td.match-stats-number-right",
          eq: 13,
          trim: true,
          convert: tr_stat
        },
        loser_total_point_won: {
          selector: "td.match-stats-number-right",
          eq: 14,
          trim: true,
          convert: tr_stat
        },
      }
    }
  });
}

if (typeof require != 'undefined' && require.main == module) {
  for_tour().then((data) => {
    json.writeJson(filename, data)
  });
}
