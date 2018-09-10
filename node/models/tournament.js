
module.exports = (sequelize, DataType) => {

  var tournament = sequelize.define('tournament', {
    flashscoreUrl: {
      type: DataType.STRING
    },
    name: {
      type: DataType.STRING
    },
    nbSetGagnant: {
      type: DataType.INTEGER
    },
    surface: {
      type: DataType.STRING
    },
    localisation: {
      type: DataType.STRING
    },
    series: {
      type: DataType.STRING
    },
    court: {
      // outdoor - ondoor
      type: DataType.STRING
    },
    date: {
      type: DataType.DATE
    }
  });

  return tournament;
}
