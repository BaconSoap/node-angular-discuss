var db = require('../db');
var fs = require('fs');
var path = require('path');
var logger = require('log4js');
var env = require('optimist').argv._[1];
var isSeed = (typeof env !== 'undefined'? env: 'migrations').toLowerCase() === "seed";
var folder = isSeed? 'seeddata/' : 'migrations/';

logger.replaceConsole();

console.log('beginning migrations');
var queue;

/**
 * Create a queue with a processing function. Exits when queue is all processed.
 * @param processor The processing function, takes in the data pushed on the queue.
 * @returns {{enqueue: Function, act: Function}}
 * @constructor
 */
function Queue(processor){
    var queued = [];
    var index = 0;

    var enqueue = function(val){
        queued.push(val);
    };

    var act = function(){
        var item = queued[index++];
        if (typeof item === 'undefined'){
            console.log('migrations complete');
            process.exit();
            return;
        }
        processor(item);
    };

    return {enqueue: enqueue, act: act};
}

/**
 * Runs a SQL file that is passed in, then asks to process the next one in the queue
 * @param fileName The filename of the SQL statements to be run
 */
var processSql = function(fileName){

    var filePath = path.resolve(__dirname, folder, fileName);
    console.log('running ' + filePath);

    //Get the SQL to run
    var sqlCommand = fs.readFileSync(filePath).toString();

    //Try to run the migration
    db.execute(sqlCommand, false, function(err,result){
        if (err){
            console.error("WHOA MIGRATION PROBLEM: " + err);
            process.exit();
            return;
        }

        console.log("migration " + fileName + " success");

        //create a migration record and then go on to the next SQL file
        if (isSeed){
            process.nextTick(function(){
                queue.act();
            });
        } else {
            migrate(fileName, function(){
                process.nextTick(function(){
                    queue.act();
                })
            });
        }
    })
}

/**
 * Create a record of the migration in the DB and then pass control to the callback. Ignores errors.
 * @param fileName
 * @param callback
 */
function migrate(fileName, callback){
    var createMigrationRecord = db.insertInto('Migrations').set('Name', fileName);
    db.execute(createMigrationRecord, fileName, callback);
}

queue = new Queue(processSql);

var files = fs.readdirSync(path.resolve(__dirname, folder));

if (isSeed){
    startProcessing(0);
    return;
}

//Start the process by seeing if the schema even exists yet
var checkSchemaExists = db.from('INFORMATION_SCHEMA.Tables').field("COUNT(*)").where("TABLE_NAME=?", 'Migrations');

db.executeScalar(checkSchemaExists, false, function(err,count){

    //if it does, pick up with the next migration
    if (parseInt(count,10) === 1){
        console.log('schema exists, resuming migrations');
        db.executeScalar("SELECT Name FROM Migrations ORDER BY MigrationID DESC LIMIT 1;", function(err, fileName){
            console.info('the latest migration run is ' + fileName);
            var starting = files.indexOf(fileName) + 1;
            startProcessing(starting);
        })
    } else {
        //create the schema and go through all migrations
        console.log('schema doesn\'t exist, beginning migrations');
        startProcessing(0);
    }
});

/**
 * Begin the processing of the migrations starting with the specifed one
 * @param startingIndex
 */
function startProcessing(startingIndex){
    for (var file = startingIndex; file < files.length; file++){
        queue.enqueue(files[file]);
    }
    queue.act();
}
