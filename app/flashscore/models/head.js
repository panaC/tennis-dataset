
module.exports = (sequelize, DataType) => {

  var head = sequelize.define('head', {
    flashscoreId: {
      type: DataType.STRING
    },
    stateFlashscore: {
      type: DataType.STRING
    },
    atpWorldTourId: {
      type: DataType.STRING
    },
    stateAtpWorldTour: {
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
    csvDataId: {
      type: DataType.STRING
    },
    stateCsvData: {
      type: DataType.STRING
    },
    injuriesId: {
      type: DataType.STRING
    },
    stateInjuries: {
      type: DataType.STRING
    },
    option: {
      type: DataType.JSONB
    },
    log: {
      type: DataType.JSONB
    }
  });

  return head;
}
