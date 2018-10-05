
module.exports = (sequelize, DataType) => {

  var weather = sequelize.define('weather', {
    weatherId: {
      type: DataType.STRING
    },
    weatherUrl: {
      type: DataType.STRING
    },
    location: {
      type: DataType.STRING
    },
    temp: {
      type: DataType.FLOAT
    },
    press: {
      type: DataType.FLOAT
    },
    humid: {
      type: DataType.FLOAT
    },
    time: {
      type: DataType.DATE
    },
    raw: {
      type: DataType.JSONB
    },
    state: {
      type: DataType.STRING
    }
  });

  return weather;
}
