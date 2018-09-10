
module.exports = (sequelize, DataType) => {

  var player = sequelize.define('player', {
    flashscoreId: {
      type: DataType.STRING
    },
    flashscoreUrl: {
      type: DataType.STRING
    },
    name: {
      type: DataType.STRING
    },
    rank: {
      type: DataType.INTEGER
    },
    age: {
      type: DataType.INTEGER
    },
    hand: {
      //left - right
      type: DataType.STRING
    }
  });

  return player;
}
