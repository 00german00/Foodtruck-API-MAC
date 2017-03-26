'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _review = require('./review');

var _review2 = _interopRequireDefault(_review);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//lays out the schema from the ddbb
var Schema = _mongoose2.default.Schema;

var FoodTruckSchema = new Schema({
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
    type: { type: String, default: 'Point' }, //Point is the default value
    coordinates: {
      "lat": Number,
      "long": Number
    }
  },
  // array of objects 'review'
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = _mongoose2.default.model('FoodTruck', FoodTruckSchema);
//# sourceMappingURL=foodtruck.js.map