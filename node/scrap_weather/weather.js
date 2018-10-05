const config      = require(__dirname + '/../config/config.js')["setting"];
const puppeteer   = require('puppeteer');
const models      = require('./../models');
const dbTools     = require('./../tools/db_tools');
const gps         = require('./gps');
const crypto      = require('crypto');
const format      = require('string-format');
const getJson     = require('get-json');
const dateFormat  = require('dateformat');

format.extend(String.prototype, {});

async function getWeather(long, lat, timestamp) {
  var res = {};
  res.state = "ok";
  var date_ = new Date(timestamp);
  var date = dateFormat(date_, "yyyymmdd");
  try {
    res.url = config.weather.format(lat, long, date);
    console.log(res.url);
    res.json = await getJson(res.url);
    if (res.json && res.json["observations"] && res.json["observations"][0]
    && res.json["observations"][0].temp) {
      res.temp = res.json["observations"][0].temp;
      res.pressure = res.json["observations"][0].pressure;
      res.humidity = res.json["observations"][0].rh
    } else {
      throw "getJson weather.com no observations data";
    }
  } catch(e) {
    res.state = "ERROR";
    res.error = e;
    console.error("ERROR weather.js", e);
  }
  return res;
}

async function setWeather(tourName, Country, timestamp) {
  var timestamp = Number(timestamp);
  var loc = tourName + ", " + Country;
  var hash = crypto.createHash('md5').update(loc + timestamp).digest("hex");
  var res = {};
  res.state = "ok";
  res.hash = hash;

  try {
    var place = await gps.getGPS(loc);
    if (place.state == "ok") {
      var data = await getWeather(place.long, place.lat, timestamp);
      if (data.state == "ok") {
        //saved weather db table
        await dbTools.upsert("weather", {
          weatherId: hash,
          weatherUrl: data.url,
          location: loc,
          temp: data.temp,
          press: data.pressure,
          humid: data.humidity,
          time: new Date(timestamp),
          raw: data.json,
          state: "ok"
        }, {
          weatherId: hash
        });
      } else {
        throw "getWeather error " + data.error;
      }
    } else {
      throw "getGPS error " + place.error;
    }
  } catch(e) {
    res.state = "ERROR";
    res.error = e;
    console.error("ERROR weather.js", e);
  }
  return res;
}

module.exports.setWeather = setWeather;

if (typeof require != 'undefined' && require.main == module) {
  setWeather(process.argv[2] || "Paris", process.argv[3] || "France",
  process.argv[4] || "1522815900000")
      .then(data => {
        console.log(data);
        models.sequelize.close();
      })
      .catch(e => {
        console.error("ERROR", e);
        models.sequelize.close();
      });
}
