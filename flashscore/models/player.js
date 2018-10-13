
module.exports = (sequelize, DataType) => {

  var player = sequelize.define('player', {
    state: {
      type: DataType.STRING
    },
    playerId: {
      type: DataType.STRING
    },
    playerUrl: {
      type: DataType.STRING
    },
    fullName: {
      type: DataType.STRING
    },
    age: {
      type: DataType.DATE
    },
    country: {
      type: DataType.STRING
    },
    hand: {
      //left - right
      type: DataType.STRING
    },
    data: {
      type: DataType.JSONB
    },
    option: {
      type: DataType.JSONB
    }
  });

  return player;
}
