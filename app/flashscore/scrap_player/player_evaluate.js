module.exports.player = function () {
  var player = {};

  try {
    var it = document.querySelector(".player-birthdate").innerText;
    var tmp = /.*\((.*)\.(.*)\.(.*)\)/.exec(it);
    player.age_timestamp = Date.UTC(tmp[3], tmp[2], tmp[1]);
  } catch(e) {
    player.age_timestamp = null;
  }
  try {
    player.fullName = document.querySelector(".team-name").innerText;
  } catch (e) {
    player.fullName = "";
  }
  return player;
};
