module.exports = {

  score: function () {

    function getScoreLine(el, pos) {
      //el : elements html

      let tmpOnclick = el.querySelector("td.fl.summary-horizontal a").attributes.onclick.value;
      //regexp on onclick value capture between quote and under quote both name and id
      var tmpRegexp = /(\/.*\/(.*)\/(.*)\/)/.exec(tmpOnclick);
      var ret = {};
      ret.playerURL = tmpRegexp['1'];
      ret.playerID = tmpRegexp['3'];
      ret.playerName = tmpRegexp['2'];

      //regexp on the same balise but only the name and country
      var tmpRegexp = /(.*) \((.*)\)/.exec(el.querySelector("td.fl.summary-horizontal a").innerText);
      ret.player = tmpRegexp['1'];
      ret.playerCountry = tmpRegexp['2'];
      ret.score = el.querySelector("td.score").innerText;
      ret.p1 = ( el.querySelector(".p1_" + pos) != null ? el.querySelector(".p1_" + pos).innerText : "" );
      ret.p2 = ( el.querySelector(".p2_" + pos) != null ? el.querySelector(".p2_" + pos).innerText : "" );
      ret.p3 = ( el.querySelector(".p3_" + pos) != null ? el.querySelector(".p3_" + pos).innerText : "" );
      ret.p4 = ( el.querySelector(".p4_" + pos) != null ? el.querySelector(".p4_" + pos).innerText : "" );
      ret.p5 = ( el.querySelector(".p5_" + pos) != null ? el.querySelector(".p5_" + pos).innerText : "" );

      return ret;
    }

    function getTimeLine(el) {
      //el : elements HTML
      let ret = {};

      //get only time line
      ret.timeAll = el.querySelector(".score").innerText;
      ret.time = [];
      el.querySelectorAll(".score").forEach((elements) => {
        ret.time.push(elements.innerText);
      });

      return ret;
    }

    var score = {};

    var el = document.querySelector("#tab-match-summary table#parts tr.odd");
    score.home = getScoreLine(el, "home");
    var el = document.querySelector("#tab-match-summary table#parts tr.even");
    score.away = getScoreLine(el, "away");
    var el = document.querySelector("#tab-match-summary table#parts tfoot.match-time");
    score.time = getTimeLine(el);

    return score;
  },

  stats: function () {

    function getStatsSet(el, pos) {
      var ret = {};

      el.querySelectorAll("div").forEach((element) => {
        if (element.attributes.class.value != "statRow--listHeader") {
          stats.set1[
            element.querySelector("div.statText.statText--titleValue").innerText] =
            element.querySelector("div.statText.statText--" + pos + "Value").innerText;
        }
      })

      return ret;
    }

    let tmpS1 = document.querySelector("div#tab-statistics-1-statistic");
    stats = getStatsSet(tmpS1, "home");
  }
};
