var index = require('../controllers/index');
var boards = require('../controllers/BoardController');

function initRoutes(app){
    initHome(app);
    initBoards(app);
}

function initHome(app){
    app.get('/', index.index);
}

function initBoards(app){
    app.get('/boards', boards.getAll);
}

module.exports.init = initRoutes;