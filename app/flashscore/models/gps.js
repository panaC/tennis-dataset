
module.exports = (sequelize, DataType) => {
  var gps = sequelize.define('gps', {
    location: {
      type: DataType.STRING
    },
    long: {
      type: DataType.STRING
    },
    lat: {
      type: DataType.STRING
    },
    raw: {
      type: DataType.JSONB
    },
    state: {
      type: DataType.STRING
    }
  });

  return gps;
}
