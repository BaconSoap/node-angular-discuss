var mysql = require('mysql');
var config = require('./config');
var logger = require('log4js');
var squel = require('squel');

logger.replaceConsole();

//Create a connection pool
var pool = mysql.createPool({
    host: config.mysql.address,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true
});

//Helper functions for squel
var from = function(table, tableAlias){
    return squel.select().from(table, tableAlias);
}

var insertInto = function(table){
    return squel.insert().into(table);
}

//Query execution functions here
/**
 * Execute a query
 * @param query The query to execute
 * @param {object} [arg1] Either a bool (whether to use Discuss DB) or the callback
 * @param {function} [arg2] The callback if arg1 isn't
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
        //if there's an error clean up and report it
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
            if(useDiscuss){
                rows = rows.slice(1)[0];
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

    //get parameters in the right order
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

        //Get the first element of the last row
        var first;
        for(var i in rows[rows.length-1]){
            if(rows[rows.length-1].hasOwnProperty(i)){
                first = rows[rows.length-1][i];
                break;
            }
        }

        //This takes care of multi-statement queries
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

/**
 * Create a prototype function from the specified Column-Property map
 * @param colToPropMap a map from DB columns/selects to JS properties
 * @returns {Function} Calling this will make an empty object with the structure specified
 */
function createPrototype(colToPropMap){
    return function(){
        var obj = {};
        for(var i in colToPropMap){
            if (colToPropMap.hasOwnProperty(i)){
                obj[colToPropMap[i]] = null;
            }
        }
        return obj;
    };
}

/**
 * Add the columns from the specified Column-Property map to the query using 'field'
 * @param query
 * @param propToColMap
 */
function addCols(query, propToColMap){
    for(var p in propToColMap){
        if (propToColMap.hasOwnProperty(p)){
            query.field(p, propToColMap[p]);
        }
    }
}

/**
 * Creates a JS object with the structure specified by the prototype function and the data from the row
 * @param prototype A function that, when called, yields the structure to populate from the row
 * @param row The data row
 * @returns {*}
 */
function createObjFromDbRow(prototype, row){
    var obj = prototype();
    for(var i in row){
        if(row.hasOwnProperty(i) && obj.hasOwnProperty(i)){
            obj[i] = row[i];
        }
    }
    return obj;
}

exports.createPrototype = createPrototype;
exports.addCols = addCols;
exports.createObjFromDbRow = createObjFromDbRow;
exports.execute = execute;
exports.executeScalar = executeScalar;
exports.from = from;
exports.insertInto = insertInto;
