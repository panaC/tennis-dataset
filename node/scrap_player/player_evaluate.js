module.exports.player = function () {
  var player = {};

  var it = document.querySelector(".player-birthdate").innerText;
  var tmp = /.*\((.*)\.(.*)\.(.*)\)/.exec(it);
  var player.age_timestamp = Date.UTC(tmp[3], tmp[2], tmp[1]);
  var player.fullName = document.querySelector(".team-name").innerText;

  return player;
};
