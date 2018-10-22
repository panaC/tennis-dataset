const scrapeIt    = require("scrape-it");
const date        = require("date-and-time");
const parsePrice  = require('parse-price');
const json        = require('./json_tools');
const format      = require('string-format');
const getTN       = require('./tour');
const getPN       = require('./players');
const models      = require('./models/');
const crypto      = require('crypto');
const tools       = require('./tools/db_tools');

const filename    = "./dataset_atpworldtour.json";

var getTourName = null;
var getPlayerName = null;

format.extend(String.prototype, {});

const sqlInnerJoinQuery = "SELECT \"heads\".\"id\" FROM \"heads\" \
INNER JOIN \"flashscores\" ON \"flashscores\".\"flashscoreId\" = \"heads\".\"flashscoreId\" \
INNER JOIN \"players\" AS home ON home.\"playerId\" = \"heads\".\"homeId\" \
INNER JOIN \"players\" AS away ON away.\"playerId\" = \"heads\".\"awayId\" WHERE \
\"flashscores\".\"tournamentName\" ILIKE \'{0}\' AND \
\"flashscores\".year = \'{1}\' AND \
((home.\"fullName\" ILIKE \'{2}\' \
AND away.\"fullName\" ILIKE \'{3}\') OR \
(away.\"fullName\" ILIKE \'{2}\' \
AND home.\"fullName\" ILIKE \'{3}\')) \
LIMIT 1";

const sqlUpdateHeadsQuery = "UPDATE \"heads\" \
SET \"atpWorldTourId\" = \'{0}\', \"stateAtpWorldTour\" = \'ok\' \
WHERE \"heads\".\"id\" = \'{1}\'";

async function setDb(o, year) {
  try {
    var tourName = getTourName.tourName(o.name);
    var winnerName = getPlayerName.playerName(o.winner);
    var looserName = getPlayerName.playerName(o.loser);

    var db = await models.sequelize.query(
      sqlInnerJoinQuery.format(tourName, year, winnerName.replace("'", "_"), looserName.replace("'", "_")), {
        raw: true
    });
    if (db[0][0] && db[0][0].id) {
      var id = db[0][0].id;
      var hash = crypto.createHash('md5').update(
        o.name + o.winner + o.loser).digest("hex");
      o.hashId = hash;
      console.log("Id find: ", id, "hash:", hash);

      try {
        tools.upsert("atpworldtour", o, {"hashId" : hash});
      } catch(e) {
        console.error("ERROR: atpworldtour create line", e);
      }

      try {
        await models.sequelize.query(sqlUpdateHeadsQuery.format(hash, id), {raw: true});
      } catch(e) {
        console.error("ERROR: head update line", e);
      }

    } else {
      console.log(/*"\x1b[47m\x1b[31m", */"ERROR: no query result", tourName, "|", o.name,  "lose:",
      o.loser, "|", looserName, "win:", o.winner, "|", winnerName /*"\x1b[0m"*/);
    }
  } catch(e) {
    console.error("ERROR: SELECT sql", e);
  }
}

async function setStat(url) {
  try {
    d_stats = await stats(url);
    return d_stats;
  } catch(e) {
    console.error("ERROR: stats", url.url, e);
  }
  return null;
}

async function for_tour() {

  let url = { url: "", proxy: "http://35.180.86.47:3030"};

  for (let i = 2001; i <= 2018; i++) {
    try {
      let year = i.toString();
      console.log("Start new tour", year);
      url.url = "https://www.atpworldtour.com/en/scores/results-archive?year=" + year;
      d_tour = await tour(url, year);
      for (let j in d_tour.data[year]) {
        try {
          d_tour.data[year][j].year = year;
          url.url = "https://www.atpworldtour.com" + d_tour.data[year][j].url;
          d_match = await match(url);
          for (let k in d_match.data["match"]) {
            if (d_match.data["match"][k].stats_url == "") {
              console.log("STATS unknown", d_tour.data[year][j].url, d_match.data["match"][k]);
            } else {
              url.url = "https://www.atpworldtour.com" + d_match.data["match"][k].stats_url;
              d_stats = await setStat(url);
              if (d_stats) {
                o = Object.assign(o, d_tour.data[year][j], d_match.data["match"][k], d_stats.data.stats);
                await setDb(o, year);
              }
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

function tr_stat() {
  return {
    ptg: x => x.split('%')[0],
    over: x => /\((.*)\/(.*)\)/.exec(x)[1],
    under: x => /\((.*)\/(.*)\)/.exec(x)[2]
  };
}

function createObjStat(str, eq, fct) {
  let tmp = {};

  function obj(pla, pos, eq, fct) {

    function createObj(pla, pos, eq, conv) {
      let tmp = {
        [pla]: {
          selector: pos,
          eq: eq,
          trim: true
        }
      }
      if (conv) {
        tmp[pla].convert = conv;
      }
      return tmp;
    }

    let tmp = {};
    if (!fct) {
      return createObj(pla, pos, eq);
    } else {
      o = fct();
      if (typeof o == "object") {
        for (let i in o) {
          tmp = Object.assign(tmp, createObj(pla + "_" + i, pos, eq, o[i]));
        }
      } else {
        return createObj(pla, pos, eq, fct);
      }
    }
    return tmp;
  }

  pos = "td.match-stats-number-left";
  pla = "winner_" + str;
  tmp = Object.assign(tmp, obj(pla, pos, eq, fct));
  pos = "td.match-stats-number-right";
  pla = "loser_" + str;
  tmp = Object.assign(tmp, obj(pla, pos, eq, fct));
  return tmp;
}

async function stats(url) {
  let o = {};
  o = Object.assign(o, createObjStat("serve_rating", 0));
  o = Object.assign(o, createObjStat("aces", 1));
  o = Object.assign(o, createObjStat("double_faults", 2));
  o = Object.assign(o, createObjStat("first_serve", 3, tr_stat));
  o = Object.assign(o, createObjStat("first_serve_point_won", 4, tr_stat));
  o = Object.assign(o, createObjStat("second_serve_point_won", 5, tr_stat));
  o = Object.assign(o, createObjStat("bp_saved", 6, tr_stat));
  o = Object.assign(o, createObjStat("service_game_played", 7));
  o = Object.assign(o, createObjStat("return_rating", 8));
  o = Object.assign(o, createObjStat("first_serve_return_point_won", 9, tr_stat));
  o = Object.assign(o, createObjStat("second_serve_return_point_won", 10, tr_stat));
  o = Object.assign(o, createObjStat("bp_converted", 11, tr_stat));
  o = Object.assign(o, createObjStat("return_games_played", 12));
  o = Object.assign(o, createObjStat("service_point_won", 13, tr_stat));
  o = Object.assign(o, createObjStat("return_point_won", 14, tr_stat));
  o = Object.assign(o, createObjStat("total_point_won", 15, tr_stat));

  return await scrapeIt(url, {
    stats: {
      selector: "div#playerStatsContainer",
      data: o
    }
  });
}

async function test() {
  getTourName = await getTN.build();
  getPlayerName = await getPN.build();
  let o = {};
  o.name = "Australian Open";
  o.winner = "Jacobo Diaz";
  o.loser = "Mikhail Youzhny";
  url = "https://www.atpworldtour.com/en/scores/2002/540/MS110/match-stats";
  year = "2002";
  d_stats = await setStat(url);
  if (d_stats) {
    o = Object.assign(o, d_stats.data.stats);
    await setDb(o, year);
  }
}

if (typeof require != 'undefined' && require.main == module) {
  // (async () => {
  //   getTourName = await getTN.build();
  //   getPlayerName = await getPN.build();
  //   await for_tour();
  // })();
  test();
}
