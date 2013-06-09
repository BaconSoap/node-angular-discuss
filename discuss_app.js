
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var config = require('./config');
var db = require('./db');

var app = express();

// all environments
app.set('port', config.port || process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/router').init(app);

db.executeScalar(db.from("Boards").field("COUNT(*)"), function(err, result){
    if (err){
        console.error(err);
        console.error('shutting down');
        process.exit(1);
        return;
    }
    console.log("initialized database. " + result + " Boards present.")
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
})