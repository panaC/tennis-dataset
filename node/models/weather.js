
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
      type: DataType.INTEGER
    },
    time: {
      type: DataType.DATE
    }
  });

  return weather;
}
