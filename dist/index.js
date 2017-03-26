'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Passport uses Strategies, a LocalStrategy is like yourr email&password stored locally
// if you use Fb it's called a Fb Strategy, if you use Google is a Googe Strategy
var LocalStrategy = require('passport-local').Strategy;

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

//middleware
//parse application/json   to limit the amount of data can be passed
//check the config file to see the limit
app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));

//passport config
app.use(_passport2.default.initialize());
var Account = require('./model/account');
_passport2.default.use(new LocalStrategy({
  usernameField: 'email', //we wil refer to this in other files by these names
  passwordField: 'password' //we wil refer to this in other files by these names
}, Account.authenticate()));
//passport serializes and deserializes so we need to do this
_passport2.default.serializeUser(Account.serializeUser());
_passport2.default.deserializeUser(Account.deserializeUser());

//api routes v1
app.use('/api/v1', _routes2.default);

app.server.listen(_config2.default.port);
console.log('Started on port ' + app.server.address().port);

exports.default = app;
//# sourceMappingURL=index.js.map