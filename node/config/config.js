module.exports = {
  development: {
    username: 'dataset',
    password: 'dataset1747',
    database: 'dataset-test',
    host: '35.204.62.91',
    dialect: 'postgres',
  },
  production: {
    username: "dataset",
    password: "dataset1747",
    database: "dataset-prod",
    host: "10.164.0.2",
    dialect: 'postgres',
  },
  setting: {
    match: "https://www.flashscore.com/match/",
    topUrl: "https://www.flashscore.com/tennis/",
    delay_waitForG: 1000,
    delay_waitForP: 200,
    dim_screen: {width: 1366, height: 768},
  }
};
