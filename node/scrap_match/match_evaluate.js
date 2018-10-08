module.exports = {

  score: function () {

    function getScoreLine(el, pos) {
      //el : elements html
      var ret = {};

      try {
        ret.score = el.querySelector("td.score").innerText;
      } catch(e) {}
      try {
        ret.p1 = ( el.querySelector(".p1_" + pos) != null ? el.querySelector(".p1_" + pos).innerText : "" );
        ret.p2 = ( el.querySelector(".p2_" + pos) != null ? el.querySelector(".p2_" + pos).innerText : "" );
        ret.p3 = ( el.querySelector(".p3_" + pos) != null ? el.querySelector(".p3_" + pos).innerText : "" );
        ret.p4 = ( el.querySelector(".p4_" + pos) != null ? el.querySelector(".p4_" + pos).innerText : "" );
        ret.p5 = ( el.querySelector(".p5_" + pos) != null ? el.querySelector(".p5_" + pos).innerText : "" );
      } catch(e) {}
      return ret;
    }

    function getTimeLine(el) {
      //el : elements HTML
      let ret = {};

      //get only time line
      try {
        ret.timeAll = el.querySelector(".score").innerText;
      } catch(e) {}
      try {
        ret.time = [];
        el.querySelectorAll(".score").forEach((elements) => {
          ret.time.push(elements.innerText);
        });
      } catch(e) {}
      return ret;
    }

    var score = {};

    try {
      var el = document.querySelector("#tab-match-summary table#parts tr.odd");
      score.home = getScoreLine(el, "home");
    } catch(e) {}
    try {
      var el = document.querySelector("#tab-match-summary table#parts tr.even");
      score.away = getScoreLine(el, "away");
    } catch(e) {}
    try {
      var el = document.querySelector("#tab-match-summary table#parts tfoot.match-time");
      score.time = getTimeLine(el);
    } catch(e) {}
    return score;
  },

  player: function () {

    function getPlayer(el, elc) {
      try {
        let tmpOnclick = el.querySelector("div.team-text a").attributes.onclick.value;
        //regexp on onclick value capture between quote and under quote both name and id
        var tmpRegexp = /(\/.*\/(.*)\/(.*))\'/.exec(tmpOnclick);
        var ret = {};
        ret.playerURL = tmpRegexp['1'];
        ret.playerID = tmpRegexp['3'];
        ret.playerName = tmpRegexp['2'];
      } catch(e) {}
      try {
        ret.player = el.querySelector("div.team-text a").innerText;
      } catch(e) {}

      try {
        //regexp on the same balise but only the name and country
        var tmpRegexp = /(.*) \((.*)\)/.exec(elc.querySelector("td.fl.summary-horizontal a").innerText);
        ret.playerCountry = tmpRegexp['2'];
      } catch(e) {}

      return ret;
    }

    var player = {};

    try {
      var el = document.querySelector("div.home-box");
      var elc = document.querySelector("tr.odd");
      player.home = getPlayer(el, elc);
    } catch(e) {}
    try {
      var el = document.querySelector("div.away-box");
      var elc = document.querySelector("tr.even");
      player.away = getPlayer(el, elc);
    } catch (e) {}

    return player;
  },

  stats: function () {

    function getStatsSet(el, pos) {
      var ret = {};

      if (el == null) {
        ret.state = "no-data";
        return ret;
      } else {
        ret.state = "ok";
      }
      try {
        el.querySelectorAll("div.statRow").forEach((element) => {
          if (element.attributes.class.value != "statRow--listHeader") {
            ret[
              element.querySelector("div.statText.statText--titleValue").innerText] =
              element.querySelector("div.statText.statText--" + pos + "Value").innerText;
            }
          });
      } catch(e) {}

      return ret;
    }

    var stats = {};
    stats.home = {};
    stats.away = {};

    var tmp;
    try {
      tmp = document.querySelector("div#tab-statistics-1-statistic");
      stats.home.set1 = getStatsSet(tmp, "home");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-2-statistic");
      stats.home.set2 = getStatsSet(tmp, "home");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-3-statistic");
      stats.home.set3 = getStatsSet(tmp, "home");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-4-statistic");
      stats.home.set4 = getStatsSet(tmp, "home");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-5-statistic");
      stats.home.set5 = getStatsSet(tmp, "home");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-1-statistic");
      stats.away.set1 = getStatsSet(tmp, "away");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-2-statistic");
      stats.away.set2 = getStatsSet(tmp, "away");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-3-statistic");
      stats.away.set3 = getStatsSet(tmp, "away");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-4-statistic");
      stats.away.set4 = getStatsSet(tmp, "away");
    } catch(e) {}
    try {
      tmp = document.querySelector("div#tab-statistics-5-statistic");
      stats.away.set5 = getStatsSet(tmp, "away");
    } catch(e) {}

    return stats;
  },

  odds: function () {
    var ret = {};

    try {
      var selector = document.querySelector("table#odds_ml");

      if (!selector) {
        ret.state = "no-data";
      } else {
        ret.state = "ok";

        selector.querySelectorAll("tbody tr").forEach((element) => {
          var name = element.querySelector("td.bookmaker a").attributes.title.value;
          ret[name] = {};
          ret[name].home = {};
          ret[name].home.odds = element.querySelectorAll("span.odds-wrap")[0].innerText;
          if (element.querySelectorAll("span.odds-wrap")[0].attributes.alt) {
            ret[name].home.range = element.querySelectorAll("span.odds-wrap")[0].attributes.alt.value;
          }
          ret[name].away = {};
          ret[name].away.odds = element.querySelectorAll("span.odds-wrap")[1].innerText;
          if (element.querySelectorAll("span.odds-wrap")[1].attributes.alt) {
            ret[name].home.range = element.querySelectorAll("span.odds-wrap")[1].attributes.alt.value;
          }
        });
      }
    } catch(e) {}

    return ret;
  },

  point: function () {

    function getPointSet(selector) {
      var ret = {};

      if (selector == null) {
        ret.state = "no-data";
        return ret;
      } else {
        ret.state = "ok";
      }

      var tiebreak = 0;

      try {
        selector.querySelectorAll("tr").forEach((element, index) => {
          if (index > 0) {
            if (element.attributes.class == undefined) {
              ret.tiebreak = {}
              tiebreak = index + 1;
            }
            if (tiebreak > 0) {
              if (element.querySelector("td.match-history-score")) {
                ret.tiebreak[index - tiebreak] = element.querySelector("td.match-history-score").innerText;
              }
            } else {
              if (ret[Math.trunc((index - 1) / 2)] == undefined) { ret[Math.trunc((index - 1) / 2)] = {}; }
              if (element.querySelector("td.match-history-score")) {
                ret[Math.trunc((index - 1) / 2)].homeAway = element.querySelector("td.match-history-score").innerText;
              }
              if (element.attributes.class.value == "odd fifteen" ||
              element.attributes.class.value == "even fifteen") {
                ret[Math.trunc((index - 1) / 2)].point = element.innerText;
              }
            }
          }
        })
      } catch(e) {}
      return ret;
    }

    var point = {};
    var selector;

    try {
      selector = document.querySelector("div#tab-mhistory-1-history");
      point.set1 = getPointSet(selector);
    } catch(e) {}
    try {
      selector = document.querySelector("div#tab-mhistory-2-history");
      point.set2 = getPointSet(selector);
    } catch(e) {}
    try {
      selector = document.querySelector("div#tab-mhistory-3-history");
      point.set3 = getPointSet(selector);
    } catch(e) {}
    try {
      selector = document.querySelector("div#tab-mhistory-4-history");
      point.set4 = getPointSet(selector);
    } catch(e) {}
    try {
      selector = document.querySelector("div#tab-mhistory-5-history");
      point.set5 = getPointSet(selector);
    } catch(e) {}

    return point;
  }
};
