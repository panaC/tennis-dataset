const config      = require(__dirname + '/../config/config.js')["setting"];
const puppeteer   = require('puppeteer');
const models      = require('./../models');
const dbTools     = require('./../tools/db_tools');
const geocoder    = require('geocoder');

geocoder.selectProvider("geonames", {
  "username": config.geonames
});

function checkLoc(loc) {
  if (loc.includes("Australian Open")) {
    return "Melbourne, Australia";
  } else if (loc.includes("Finals - London")) {
    return "London, England";
  } else if (loc.includes("French Open")) {
    return "Paris, France";
  } else if (loc.includes("US Open")) {
    return "New-york, USA";
  } else if (loc.includes("Wimbledon")) {
    return "London, England";
  }
  return loc;
}

// Param long, lat : GPS coordonate
// return state: "ok" || "ERROR" || "unknown"
async function setGPS(loc) {
  var res = {};
  res.state = "ok";
  res.long = "0";
  res.lat = "0";
  res.json = {};

  try {
    var geo = await geocoder.geocode(loc);
    if (geo.totalResultsCount == 0) {
      res.state = "unknown";
    } else {
      res.json = geo.geonames[0]
      res.long = geo.geonames[0].lng;
      res.lat = geo.geonames[0].lat;
    }
    await dbTools.upsert("gps", {
      location: loc,
      long: res.long,
      lat: res.lat,
      raw: res.json,
      state: res.state
    }, {
      location: loc
    })
  } catch(e) {
    res.state = "ERROR";
    res.error = e;
    console.error("ERROR gps.js", e);
  }
  return res;
}

// loc = "tournamentName, country"

// Param loc fullName : tournamentName, country
// return long/lat if find
// else return null
async function getGPS(loc) {
  var res = {};
  res.state = "ok";
  var tmp = await models.gps.findOne({
    where: {
      location: checkLoc(loc)
    }
  })
  if (tmp == null) {
    var set = await setGPS(checkLoc(loc));
    if (set.state == "ok") {
      res.long = res.long;
      res.lat = res.lat;
    } else {
      res.state = set.state;
      if (set.state == "ERROR") {
        res.error = set.error;
      }
    }
  } else {
    res.long = tmp.dataValues.long;
    res.lat = tmp.dataValues.lat;
  }
  return res;
}

module.exports.getGPS = getGPS;

if (typeof require != 'undefined' && require.main == module) {
  getGPS(process.argv[2] || "Costa Do Sauipe, Brazil")
      .then(data => {
        console.log(data);
        models.sequelize.close();
      })
      .catch(e => {
        console.error("ERROR", e);
        models.sequelize.close();
      });
}
