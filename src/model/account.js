import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

//passport is a package that makes authentication very easy. You can use different strategies
//by doing it locally or with Facebook or Google...

let Account = new Schema({
  email: String,
  password: String
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);
