'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _authmiddleware = require('../middleware/authmiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//to allow restriction of acces in some routes

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // CRUD - Create Read Update Delete

  // '/v1/foodtruck/add' = Create
  api.post('/add', _authmiddleware.authenticate, function (req, res) {
    // if we remove the comments from /*authenticate,*/ then it will require login before you can create a new foodtruck
    var newFoodTruck = new _foodtruck2.default();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
    foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    // save is a method from mongoose
    newFoodTruck.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved successfully' });
    });
  });

  // '/v1/foodtruck'  - Read
  api.get('/', function (req, res) {
    _foodtruck2.default.find({}, function (err, foodtrucks) {
      //empty {} means to get everything. If we put something it wil return that.
      // => (err, foodtrucks) means we either will get an error or a foodtrucks

      // if we get an error, we will send it back with the response to the client
      if (err) {
        res.send(err);
      }
      //if we don´t get the error, we get all the foodtrucks and we send it back
      //in the response as a json
      res.json(foodtrucks);
    });
  });

  //How to read one specific registry not all
  // '/v1/foodtruck/:id' - Read
  api.get('/:id', function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      //res.send(foodtruck.name);
      res.json(foodtruck);
    });
  });

  // Read all foodtrucks by foodtype
  // '/v1/foodtruck/foodtype/:foodtype'
  api.get('/foodtype/:foodtype', function (req, res) {
    _foodtruck2.default.find({ foodtype: req.params.foodtype }, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  // Update the record with a put method
  // '/v1/foodtruck/:id' - Update
  api.put('/:id', _authmiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      // save the name of the foodtruck in the db just like the one from the
      // request body
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
      foodtruck.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "FoodTruck info updated" });
      });
    });
  });

  // Remove a foodtruck and it's reviews
  // '/v1/foodtruck/:id' - Delete
  api.delete('/:id', _authmiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        // we can inform of the status code and send whatever we want to the console.
        res.status(500).send(err);
        return;
      }
      if (foodtruck == null) {
        // yo can check for the meanings of the satus codes online
        res.status(404).send("Foodtruck not found");
        return;
      }
      _foodtruck2.default.remove({
        _id: req.params.id
      }, function (err, foodtruck) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        _review2.default.remove({ foodtruck: req.params.id }, function (err, review) {
          if (err) {
            res.send(err);
          }
          res.json({ message: "FoodTruck and Reviews removed OK" });
        });
      });
    });
  });

  // add review for a specific foodtruck id
  // '/v1/foodtruck/reviews/add/:id'
  api.post('/reviews/add/:id', _authmiddleware.authenticate, function (req, res) {
    _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
      if (err) {
        res.send(err);
      }
      var newReview = new _review2.default();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id; //link the foodtruck id to the review
      newReview.save(function (err, review) {
        if (err) {
          res.send(err);
        }
        // we have to push the object to the end of the array of reviews
        // and we have to save it!
        foodtruck.reviews.push(newReview);
        foodtruck.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Food truck review saved!' });
        });
      });
    });
  });

  //get reviews for a specific food truck id
  // '/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id', function (req, res) {
    _review2.default.find({ foodtruck: req.params.id }, function (err, reviews) {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    });
  });

  return api; /////////////////
};
//# sourceMappingURL=foodtruck.js.map