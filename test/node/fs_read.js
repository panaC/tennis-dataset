fs = require('fs');

fs.readFile('link_flashscore_raw.csv', 'utf8', (err, data) => {
  file = ""
  if (err) throw err;

  url = data.replace(/\n/g, '').replace(/ /g, '').split(',');
  url.forEach((link, index, array) => {
    array[index] = link.replace(/\"/g, '').replace(/.$/, '');
  });
  url.forEach((link) => {
    for (let i = 2001; i < 2019; i++) {
      url_result = link + '-' + i + '/' + "results";
      url_player = link + '-' + i + '/' + "players";
      file += url_result + ',' + url_player + ',';
    }
  })
  fs.writeFile('link_tournament_flashscore.csv', file.replace(/.$/, ''), (err) => {
    if (err) throw err;
  });
});
