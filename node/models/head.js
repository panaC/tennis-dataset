
module.exports = (sequelize, DataType) => {

  var head = sequelize.define('head', {
    flashscoreId: {
      type: DataType.STRING
    },
    stateFlashscore: {
      type: DataType.STRING
    },
    weatherId: {
      type: DataType.STRING
    },
    stateWeather: {
      type: DataType.STRING
    },
    bookmakerId: {
      type: DataType.STRING
    },
    stateBookmaker: {
      type: DataType.STRING
    },
    homeId: {
      type: DataType.STRING
    },
    stateHome: {
      type: DataType.STRING
    },
    awayId: {
      type: DataType.STRING
    },
    stateAway: {
      type: DataType.STRING
    },
    datasetId: {
      type: DataType.STRING
    },
    stateDataset: {
      type: DataType.STRING
    },
    log: {
      type: DataType.JSONB
    }
  });

  return head;
}
