var m = require('../models/BoardModel');

/*
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};