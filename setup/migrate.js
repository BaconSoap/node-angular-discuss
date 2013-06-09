var db = require('../db');
var fs = require('fs');
var path = require('path');
var logger = require('log4js');

logger.replaceConsole();

console.log('beginning migrations');

function Queue(processor){
    var queued = [];
    var index = 0;

    var enqueue = function(val){
        queued.push(val);
    }

    var act = function(){
        var item = queued[index++];
        if (typeof item === 'undefined'){
            console.log('migrations complete')
            process.exit();
            return;
        }
        processor(item);
    }

    return {enqueue: enqueue, act: act};
}

var processSql = function(fileName){
    var filePath = path.resolve(__dirname, 'migrations/', fileName)
    console.log('running ' + filePath);
    var sqlCommand = fs.readFileSync(filePath).toString();
    db.execute(sqlCommand, function(err,result){
        if (err){
            console.error("WHOA MIGRATION PROBLEM: " + err);
            process.exit();
        }
        console.log("migration " + fileName + " success");
        migrate(fileName, function(){
            process.nextTick(function(){
                queue.act();
            })
        });
    })
}

function migrate(fileName, callback){
    db.execute("USE Discuss; INSERT INTO Migrations (Name) VALUE (?)", fileName, callback);
}

var queue = new Queue(processSql);

var files = fs.readdirSync(path.resolve(__dirname, 'migrations/'));

db.executeScalar("SELECT COUNT(*) FROM Information_Schema.tables WHERE TABLE_NAME='Migrations';", function(err,count){
    if (parseInt(count,10) === 1){
        console.log('schema exists, resuming migrations');
        db.executeScalar("USE Discuss; SELECT Name FROM Migrations ORDER BY DateRun DESC LIMIT 1;", function(err, fileName){
            console.info('the latest migration run is ' + fileName);
            var starting = files.indexOf(fileName) + 1;
            startProcessing(starting);
        })
    } else {
        console.log('schema doesn\'t exist, beginning migrations');
        startProcessing(0);
    }
})

function startProcessing(startingIndex){
    for (var file = startingIndex; file < files.length; file++){
        queue.enqueue(files[file]);
    }
    queue.act();
}
