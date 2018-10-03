
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
    surface: {
      type: DataType.STRING
    },
    year: {
      type: DataType.INTEGER
    },
    dateTime: {
      type: DataType.DATE
    },
    data: {
      type: DataType.JSONB
    }
  });
  // TODO: ADD datetime field

  return flashscore;
}
