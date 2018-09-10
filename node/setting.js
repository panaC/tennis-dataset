const models = require('./models');

models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    models.tournament.sync({force: true}).then(() => {
      console.log('Table tournament created.');
      models.match.sync({force: true}).then(() => {
        console.log('Table match created.');
        models.player.sync({force: true}).then(() => {
          console.log('Table player created.');
          models.sequelize.close()
        });
      });
    });
  })
  .catch(err => {
    console.log('table not created : ', err);
    models.sequelize.close()
  })
