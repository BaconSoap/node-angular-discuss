var mysql = require('mysql');
var config = require('./config');

var pool = mysql.createPool({
    host: config.mysql.address,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true
});

/**
 * Execute a query, optionally using parameterized variables ('?')
 * @param query The query to execute
 * @param arg1 Either an array of variables to parameterize or the callback
 * @param arg2 The callback if arg1 isn't
 */
var execute = function(query, arg1, arg2) {
    var args, callback;

    //set parameterization and the callback
    if (typeof arg2 === 'undefined'){
        args = [];
        callback = arg1;
    } else {
        args = arg1;
        callback = arg2;
    }

    pool.getConnection(function(err,conn){
        if (err){
            callback(err);
            if (conn){
                conn.end();
            }
            return;
        }
        conn.query(query, args, function(err,rows){
            conn.end();
            if (err){
                callback(err);
                return;
            }

            callback(null, rows);
        })
    })
};

/**
 * Take the first value in the last row of the result set returned by the query
 * @param query
 * @param callback
 */
var executeScalar = function(query, callback){
    execute(query, function(err, rows) {
        if (err){
            callback(err);
            return;
        }
        var first;
        for(var i in rows[rows.length-1]){
            if(rows[rows.length-1].hasOwnProperty(i)){
                first = rows[rows.length-1][i];
                break;
            }
        }
        if (typeof first === 'object'){
            for(var i in first){
                if (first.hasOwnProperty(i)){
                    first = first[i];
                    break;
                }
            }
        }
        callback(null, first);
    });
};

var visible = {execute:execute, executeScalar:executeScalar};

module.exports = visible;