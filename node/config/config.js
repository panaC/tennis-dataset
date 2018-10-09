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
  prod_aws: {
    username: "dataset",
    password: "dataset1747",
    database: "dataset-prod",
    host: "35.204.62.91",
    dialect: 'postgres',
  },
  setting: {
    match: "https://www.flashscore.com/match/",
    topUrl: "https://www.flashscore.com/tennis/",
    rootUrl: "https://www.flashscore.com",
    weather: "https://api.weather.com/v1/geocode/{0}/{1}/observations/historical.json?apiKey=6532d6454b8aa370768e63d6ba5a832e&startDate={2}&endDate={2}&units=e",
    geonames: "panacpp",
    delay_waitForG: 500,
    delay_waitForP: 50,
    dim_screen: {width: 1366, height: 768},
    browserless_ip: /*"35.180.86.47"*/"127.0.0.1",
    browserless_port: 3030
  }
};
