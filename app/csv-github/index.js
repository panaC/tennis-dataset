const config  = require(__dirname + './../flashscore/config/config.js')["setting"];
const models  = require('./models');
const exec    = require('child-process-promise').exec;
const neatCsv = require('neat-csv');
