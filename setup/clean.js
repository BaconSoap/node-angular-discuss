var db = require("../db.js");
var args = require('optimist').argv._;
require('log4js').replaceConsole();

if ((args[0] + "").toLowerCase() === 'production'){
    //dafuq do you think you're doing
    console.error("NOT IN PRODUCTION YOU DON'T");
    process.exit(1);
}

db.execute("DROP SCHEMA IF EXISTS Discuss", function(err, result){
    if (err){
        console.log('error' + err);
    } else {
        console.log('clean complete');
        console.log(result);
    }

    process.exit();
});