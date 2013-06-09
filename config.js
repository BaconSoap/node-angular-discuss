var fs = require('fs');

var args = require('optimist').argv._;

var environment = 'development';
if (typeof args[0] !== 'undefined'){
    environment = args[0];
}
var filePath = "./config/" + environment + ".json";

if (!fs.existsSync(filePath)){
    filePath = "./config/config.json";
}
var config = JSON.parse(fs.readFileSync(filePath));

module.exports = config;