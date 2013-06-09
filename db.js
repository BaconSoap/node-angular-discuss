var mysql = require('mysql');
var config = require('./config');
var logger = require('log4js');
var squel = require('squel');

logger.replaceConsole();

var pool = mysql.createPool({
    host: config.mysql.address,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true
});

var from = function(table, tableAlias){
    return squel.select().from(table, tableAlias);
}

var insertInto = function(table){
    return squel.insert().into(table);
}

/**
 * Execute a query
 * @param query The query to execute
 * @param arg1 Either a bool (whether to use Discuss DB) or the callback
 * @param arg2 The callback if arg1 isn't
 */
var execute = function(query, arg1, arg2) {
    var useDiscuss, callback;
    query = query.toString();

    if (typeof arg2 === 'undefined'){
        useDiscuss = true;
        callback = arg1;
    } else {
        useDiscuss = arg1;
        callback = arg2;
    }

    if (useDiscuss){
        query = 'USE Discuss; \r\n' + query;
    }

    pool.getConnection(function(err,conn){
        if (err){
            callback(err);
            if (conn){
                conn.end();
            }
            return;
        }
        conn.query(query, function(err,rows){
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
var executeScalar = function(query, arg1, arg2){

    var useDiscuss, callback;

    if (typeof arg2 === 'undefined'){
        useDiscuss = true;
        callback = arg1;
    } else {
        useDiscuss = arg1;
        callback = arg2;
    }

    execute(query, useDiscuss, function(err, rows) {
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

var visible = {
    execute:execute,
    executeScalar:executeScalar,
    from: from,
    insertInto: insertInto
};

module.exports = visible;