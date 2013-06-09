var fs = require('fs');

var config = JSON.parse(fs.readFileSync("./config/development.json"));

module.exports = config;