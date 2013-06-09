var fs = require('fs');

var args = require('optimist').argv._;

var environment = 'development';
if (typeof args[0] !== 'undefined'){
    environment = args[0];
}
var config = JSON.parse(fs.readFileSync("./config/" + environment + ".json"));

module.exports = config;