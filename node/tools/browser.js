const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/../config/config.js')["setting"];

module.exports.browser = async function (url) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'ws://' + config.browserless_ip + ':' + config.browserless_port,
    defaultViewport: config.dim_screen
  });
  //const browser = await browser_.createIncognitoBrowserContext();

  var page = await browser.newPage();
  // Start URL
  await page.goto(url);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  return page;
};

module.exports.goto = async function (page, url) {
  await page.goto(url);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  return page;
};
