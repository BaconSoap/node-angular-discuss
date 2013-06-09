var index = require('./index');
var user = require('./user');

function initRoutes(app){
    app.get('/', index.index);
    app.get('/users', user.list);
}

module.exports.init = initRoutes;