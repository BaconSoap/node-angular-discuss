var db = require("../db");
var tableName = 'Boards';

var actions = {
    getAll: function(limit, callback){
        console.log('getting all');
        var query = db
            .from(tableName)
            .field('Name', 'name')
            .field('BoardID', 'boardId')
            .order("BoardID");

        db.execute(query, function(err, data){
            callback(err,data);
        });
    }
}

exports.getAll = actions.getAll;