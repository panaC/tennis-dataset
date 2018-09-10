
module.exports = (sequelize, DataType) => {

  var match = sequelize.define('match', {
    flashscoreUrl: {
      type: DataType.STRING
    },
    flashscoreId: {
      type: DataType.STRING
    },
    eventId: {
      type: DataType.STRING
    },
    tournamentId: {
      type: DataType.STRING
    },
    homeId: {
      type: DataType.STRING
    },
    awayId: {
      type: DataType.STRING
    },
    state: {
      type: DataType.STRING
    },
    round: {
      type: DataType.STRING
    },
    qualification: {
      type: DataType.BOOLEAN
    },
    resultHome: {
      type: DataType.INTEGER
    },
    resultAway: {
      type: DataType.INTEGER
    },
    resultTime: {
      type: DataType.INTEGER
    },
    nbSet: {
      type: DataType.INTEGER
    },
    winner: {
      //home - away
      type: DataType.STRING
    },
    score: {
      type: DataType.JSONB
    },
    odds: {
      type: DataType.JSONB
    },
    statistics: {
      type: DataType.JSONB
    }
  });

  return match;
}

// p1Home: {
//   type: DataType.INTEGER
// },
// p1Away: {
//   type: DataType.INTEGER
// },
// p1Time: {
//   type: DataType.INTEGER
// },
// p2Home: {
//   type: DataType.INTEGER
// },
// p2Away: {
//   type: DataType.INTEGER
// },
// p2Time: {
//   type: DataType.INTEGER
// },
// p3Home: {
//   type: DataType.INTEGER
// },
// p3Away: {
//   type: DataType.INTEGER
// },
// p3Time: {
//   type: DataType.INTEGER
// },
// p4Home: {
//   type: DataType.INTEGER
// },
// p4Away: {
//   type: DataType.INTEGER
// },
// p4Time: {
//   type: DataType.INTEGER
// },
// p5Home: {
//   type: DataType.INTEGER
// },
// p5Away: {
//   type: DataType.INTEGER
// },
// p5Time: {
//   type: DataType.INTEGER
// },
