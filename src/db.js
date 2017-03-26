import mongoose from 'mongoose';
import config from './config';

export default callback => {
  //mongoose.Promise = global.promise;   // to stop receiving the warning about this library being deprecated
  let db = mongoose.connect(config.mongoUrl);
  callback(db);
}
