var Boards = require('../models/BoardModel');

function getAll(req, res){
    Boards.getAll(0, function(err, data){
        res.send(data);
    });
}

exports.getAll = getAll;