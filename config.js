var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config/development.json"));

console.log(config);

module.exports = config;