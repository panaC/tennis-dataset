const models = require('./models');

models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    models.csv.sync({force: true}).then(() => {
      console.log('Table csv created.');
    });
  })
  .catch(err => {
    console.log('table not created : ', err);
    models.sequelize.close()
  })
