var db = require("../db");
var tableName = 'Boards';

var dbJsMap = {
    'BoardId':'id',
    'Name':'name',
    'DateCreated': 'created'
}

var Board = db.createPrototype(dbJsMap);

var actions = {
    getAll: function(limit, callback){
        console.log('getting all');
        var query = db
            .from(tableName)
            .order("BoardID");

        db.addCols(query, dbJsMap);
        db.execute(query, function(err, data){
            data = data.map(function(r){return db.createObjFromDbRow(Board, r)});
            callback(err,data);
        });
    }
}

exports.getAll = actions.getAll;