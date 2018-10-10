const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/../config/config.js')["setting"];

module.exports.browser = async function browser (url) {
  try {
    var browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://' + config.browserless_ip + ':' + config.browserless_port,
      defaultViewport: config.dim_screen
    });

    var page = await browser.newPage();
    // Start URL
    await page.goto(url);
    await page.waitFor(config.delay_waitForG); // wait for stabilization
  } catch(e) {
    return await browser(url);
  }
  //const browser = await browser_.createIncognitoBrowserContext();
  return page;
};

module.exports.goto = async function (page, url) {
  await page.goto(url);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  return page;
};
