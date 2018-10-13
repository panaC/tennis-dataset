const puppeteer   = require('puppeteer');
const config      = require(__dirname + '/../config/config.js')["setting"];
const url_        = require('url');

async function browser (url) {

  async function bro(url) {
    var brow = await puppeteer.connect({
      browserWSEndpoint: 'ws://' + config.browserless_ip + ':' + config.browserless_port +
      '?--proxy-server=' + config.proxy,
      //'&--window-size=1366x768' +
      //'&--no-sandbox=true' +
      //'&--disable-setuid-sandbox=true' +
      //'&--disable-dev-shm-usage=true' +
      //'&--disable-accelerated-2d-canvas=true' +
      //'&--disable-gpu=true',
      defaultViewport: config.dim_screen
    });

    //var brow = await puppeteer.launch({args: [ "--proxy-server=35.180.86.47:3030" ]});

    var page = await brow.newPage();
    // Start URL
    //console.log("START", url);

    await page.setRequestInterception(true);
    page.on('request', request => {
      var state = url_.parse(request._url, true).host.includes("flashscore.com") ||
      url_.parse(request._url, true).host.includes("livesportmedia.eu");
      if ((request.resourceType() === 'xhr' && state) ||
          (request.resourceType() === 'script' && state) ||
          request.resourceType() === 'document' && state) {
        request.continue();
        //console.log("REQUEST:", request.resourceType(), request._url);
      } else {
        request.abort();
      }
    });

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
