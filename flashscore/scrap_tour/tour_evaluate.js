module.exports = {

  tourUrl: function () {
    let elements = Array.from(document.querySelector("li#lmenu_5724").querySelector("ul.submenu").querySelectorAll("a"));
    let links = elements.map(element => {
      return [ element.href, element.innerText ]
    });
    return links;
  },

  linkYears: function () {
    let elements = Array.from(document.querySelector(".tournament-page-archiv").querySelectorAll("a"));
    let links = elements.map((element, index) => {
      return (index % 2 == 0 ? [ element.href,
        /(19[5-9]\d|20[0-4]\d|2050)$/.exec(element.innerText)[0] ] : null );
    });
    return links;
  },

  tourYears: function () {
    //display all match
    loadMoreGames();
    loadMoreGames();


    var retu = [];
    //Warning querySelectorAll return n+1 cases : n element and the length
    var arrayTable = document.querySelectorAll("table.tennis");

    arrayTable.forEach((atVal) => {

      var tmp = {};
      var roun = "";
      var headline = atVal.querySelector("thead").innerText;
      tmp.qualification = headline.includes("Qualification");
      if (headline.includes("Davis Cup")) {
        tmp.surface = "hard";
        tmp.country = "World";
        tmp.indoor = true;
      } else {
        tmp.surface = headline.split(', ')[1].slice(0, -1);
        tmp.country = /.*\((.*)\).*, (.*) .*/.exec(headline.slice(0, -1) + " ")[1];
        tmp.indoor = headline.includes("indoor");
      }
      tmp.match = [];
      var arrayTableMatch = atVal.querySelectorAll("tbody tr");
      arrayTableMatch.forEach((atmVal) => {
        if (!atmVal.id) {
          roun = atmVal.innerText;
        } else {
          //parsing Date
          var date = atmVal.querySelector("td.time").innerText;
          var month = date.split('.')[1];
          var day = date.split('.')[0];
          var hour = date.split('. ')[1].split(':')[0];
          var min = date.split('. ')[1].split(':')[1];
          // add to array Match
          tmp.match.push({
            round: roun,
            id: atmVal.id.split('_')[2],
            month: month,
            day: day,
            hour: hour,
            min: min
          });
        }
      });
      retu.push(tmp);
    });
    return retu;
  }
}
