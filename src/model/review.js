import mongoose from 'mongoose';
import FoodTruck from './foodtruck';
let Schema = mongoose.Schema;


let ReviewSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  text: String,
  foodtruck: {
    type: Schema.Types.ObjectId,  //id of the ObjectId automatically assigned
    food: String,
    ref: 'FoodTruck',
    required: true
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
