
module.exports = (sequelize, DataType) => {

  var head = sequelize.define('head', {
    flashscoreId: {
      type: DataType.STRING
    },
    stateFlashscore: {
      type: DataType.STRING
    },
    weatherId: {
      type: DataType.INTEGER
    },
    stateWeather: {
      type: DataType.STRING
    },
    bookmakerId: {
      type: DataType.INTEGER
    },
    stateBookmaker: {
      type: DataType.STRING
    },
    homeId: {
      type: DataType.INTEGER
    },
    stateHome: {
      type: DataType.STRING
    },
    awayId: {
      type: DataType.INTEGER
    },
    stateAway: {
      type: DataType.STRING
    },
    log: {
      type: DataType.JSONB
    }
  });

  return head;
}
