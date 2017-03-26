import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config';
import routes from './routes';
import passport from 'passport';
//Passport uses Strategies, a LocalStrategy is like yourr email&password stored locally
// if you use Fb it's called a Fb Strategy, if you use Google is a Googe Strategy
const LocalStrategy = require('passport-local').Strategy;

let app = express();
app.server = http.createServer(app);

//middleware
//parse application/json   to limit the amount of data can be passed
//check the config file to see the limit
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

//passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',     //we wil refer to this in other files by these names
  passwordField: 'password'   //we wil refer to this in other files by these names
},
  Account.authenticate()
));
//passport serializes and deserializes so we need to do this
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//api routes v1
app.use('/api/v1', routes);

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;
