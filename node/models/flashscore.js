
module.exports = (sequelize, DataType) => {

  var flashscore = sequelize.define('flashscore', {
    state: {
      type: DataType.STRING
    },
    matchUrl: {
      type: DataType.STRING
    },
    tournamentUrl: {
      type: DataType.STRING
    },
    flashscoreId: {
      type: DataType.STRING
    },
    tournamentName: {
      type: DataType.STRING
    },
    round: {
      type: DataType.STRING
    },
    qualification: {
      type: DataType.BOOLEAN
    },
    indoor: {
      type: DataType.BOOLEAN
    },
    surface: {
      type: DataType.STRING
    },
    country: {
      type: DataType.STRING
    },
    year: {
      type: DataType.INTEGER
    },
    dateTime: {
      type: DataType.DATE
    },
    option: {
      type: DataType.JSONB
    },
    data: {
      type: DataType.JSONB
    }
  });

  return flashscore;
}
