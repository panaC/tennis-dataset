const config      = require(__dirname + '/../config/config.js')["setting"];
const puppeteer   = require('puppeteer');
const models      = require('./../models');
const dbTools     = require('./../tools/db_tools');
const gps         = require('./gps');


async function getWeather(long, lat, timestamp) {
  var res = {};
  res.state = "ok";
  var date_ = new Date(timestamp);
  var date = date_.getFullYear() + date_.getMonth() + date_.getDay();

  try {
    var json = await getJson(config.weather.format(long, lat, date));
    if (json["observations"] && json["observations"][0]
    && json["observations"][0].temp
    && json["observations"][0].pressure
    && json["observations"][0].rh) {
      res.temp = json["observations"][0].temp;
      res.pressure = json["observations"][0].pressure;
      res.humidity = json["observations"][0].rh
    } else {
      throw "getJson weather.com no observations data";
    }
  } catch(e) {
    res.state = "ERROR";
    res.error = e;
    console.error("ERROR weather.js", e);
  }
}

async function setWeather(tourName, Country, timestamp) {
  var loc = tourName + ", " + Country;
  var place = await getGPS(loc);

  if (place.state == "ok") {
    var data = await getWeather(place.long, place.lat, timestamp);
    if (data.state == "ok") {
      //saved weather db table
      // return dataValues.id
    }
  }
}

module.exports.setWeather = setWeather;

if (typeof require != 'undefined' && require.main == module) {
  setWeather(process.argv[2] || "Costa Do Sauipe, Brazil")
      .then(data => {
        console.log(data);
        models.sequelize.close();
      })
      .catch(e => {
        console.error("ERROR", e);
        models.sequelize.close();
      });
}
