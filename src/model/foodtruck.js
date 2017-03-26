import mongoose from 'mongoose';
import Review from './review';
//lays out the schema from the ddbb
let Schema = mongoose.Schema;

let FoodTruckSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  foodtype: {
    type: String,
    required: true
  },
  avgcost: Number,
  geometry: {
    type: { type: String, default: 'Point'}, //Point is the default value
    coordinates: {
      "lat": Number,
      "long": Number
    }
  },
  // array of objects 'review'
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
