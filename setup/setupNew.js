require('log4js').replaceConsole();
var fs = require('fs');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var config = {mysql: {}};
var messages = ["host","port", "mysqlAddress", "mysqlPort", "mysqlUser", "mysqlPassword"];
var responses = [];
var index = 0;
console.log(messages[0]);
rl.on('line', function (cmd) {
    responses.push(cmd);
    if (index < messages.length - 1){
        console.log(messages[++index]);
    } else {
        for(var i = 0; i < responses.length;i++){
            switch(i){
                case 0:
                    config.host = responses[i];
                    break;
                case 1:
                    config.port = responses[i];
                    break;
                case 2:
                    config.mysql.address = responses[i];
                    break;
                case 3:
                    config.mysql.port = responses[i];
                    break;
                case 4:
                    config.mysql.user = responses[i];
                    break;
                case 5:
                    config.mysql.password = responses[i];
                    break;
            }
        }
        fs.writeFileSync("config/development.json", JSON.stringify(config));
        //begin migrations using just-created config.
        require('./migrate');
    }
});