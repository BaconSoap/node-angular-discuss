var index = require('../controllers/index');

function initRoutes(app){
    initHome(app);
    initBoards(app);
}

function initHome(app){
    app.get('/', index.index);
}

function initBoards(app){

}

module.exports.init = initRoutes;