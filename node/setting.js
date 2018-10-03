const models = require('./models');

models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    models.head.sync({force: true}).then(() => {
      console.log('Table head created.');
      models.flashscore.sync({force: true}).then(() => {
        console.log('Tasble flashscore created.');
        models.player.sync({force: true}).then(() => {
          console.log('Table player created.');
          models.weather.sync({force: true}).then(() => {
            console.log('Table weather created.');
            models.sequelize.close();
          });
        });
      });
    });
  })
  .catch(err => {
    console.log('table not created : ', err);
    models.sequelize.close()
  })
