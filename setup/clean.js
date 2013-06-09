var db = require("../db.js");

db.execute("DROP SCHEMA IF EXISTS Discuss", function(err, result){
    if (err){
        console.log('error' + err);
    } else {
        console.log('clean complete');
        console.log(result);
    }

    process.exit();
});