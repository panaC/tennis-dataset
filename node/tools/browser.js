const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/../config/config.js')["setting"];

async function browser (url) {

  async function bro(url) {
    var browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://' + config.browserless_ip + ':' + config.browserless_port +
      '?--proxy-server=\"' + config.proxy + '\"',
      //'&--window-size=1366x768' +
      //'&--no-sandbox=true' +
      //'&--disable-setuid-sandbox=true' +
      //'&--disable-dev-shm-usage=true' +
      //'&--disable-accelerated-2d-canvas=true' +
      //'&--disable-gpu=true',
      defaultViewport: config.dim_screen
    });

    var page = await browser.newPage();
    // Start URL
    await page.goto(url);
    await page.waitFor(config.delay_waitForG); // wait for stabilization

    return page;
  }
  try {
    var page =  await bro(url);
  } catch(e) {
    console.error("ERROR browser.js", e);
    var page =  await bro(url);
  }
  //const browser = await browser_.createIncognitoBrowserContext();
  return page;
};

module.exports.goto = async function (page, url) {
  await page.goto(url);
  await page.waitFor(config.delay_waitForG); // wait for stabilization

  return page;
};

module.exports.browser = browser;
