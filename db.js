var mysql = require('mysql');
var config = require('./config');

var pool = mysql.createPool({
    host: config.mysql.address,
    user: config.mysql.user,
    password: config.mysql.password
});

/**
 *
 * @param query
 * @param callback
 */
var executeScalar = function(query, callback){
    pool.getConnection(function(err,conn){
        if (err){
            callback(err);
            conn.end();
            return;
        }
        conn.query(query, function(err,rows){
            if (err){
                callback(err);
                conn.end();
                return;
            }
            var first;
            for(var i in rows[0]){
                if(rows[0].hasOwnProperty(i)){
                    first = rows[0][i];
                    break;
                }
            }
            callback(null, first);
        })
    })
}

exports.executeScalar = executeScalar;