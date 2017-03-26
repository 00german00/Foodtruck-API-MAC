import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import bodyParser from 'body-parser';

import { authenticate} from '../middleware/authmiddleware'; //to allow restriction of acces in some routes

export default({ config, db }) => {
  let api = Router();

// CRUD - Create Read Update Delete

// '/v1/foodtruck/add' = Create
api.post('/add', authenticate, (req, res) => {  // if we remove the comments from /*authenticate,*/ then it will require login before you can create a new foodtruck
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
    foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    // save is a method from mongoose
    newFoodTruck.save(err => {
      if(err) {
        res.send(err);
      }
      res.json({ message:'FoodTruck saved successfully' });
    });
  });

// '/v1/foodtruck'  - Read
api.get('/', (req, res) => {
  FoodTruck.find({}, (err, foodtrucks) => {
  //empty {} means to get everything. If we put something it wil return that.
  // => (err, foodtrucks) means we either will get an error or a foodtrucks

  // if we get an error, we will send it back with the response to the client
  if(err){
    res.send(err);
  }
  //if we don´t get the error, we get all the foodtrucks and we send it back
  //in the response as a json
  res.json(foodtrucks);
  });
});

//How to read one specific registry not all
// '/v1/foodtruck/:id' - Read
api.get('/:id', (req, res) => {
  FoodTruck.findById(req.params.id, (err, foodtruck) => {
    if(err) {
      res.send(err);
    }
    //res.send(foodtruck.name);
    res.json(foodtruck);
  });
});

// Read all foodtrucks by foodtype
// '/v1/foodtruck/foodtype/:foodtype'
api.get('/foodtype/:foodtype', (req, res) => {
  FoodTruck.find({ foodtype: req.params.foodtype }, (err, foodtruck) => {
    if(err) {
      res.send(err);
    }
    res.json(foodtruck);
  });
});

// Update the record with a put method
// '/v1/foodtruck/:id' - Update
api.put('/:id', authenticate, (req, res) => {
  FoodTruck.findById(req.params.id, (err, foodtruck) => {
    if(err) {
      res.send(err);
    }
    // save the name of the foodtruck in the db just like the one from the
    // request body
    foodtruck.name = req.body.name;
    foodtruck.foodtype = req.body.foodtype;
    foodtruck.avgcost = req.body.avgcost;
    foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;
    foodtruck.save(err => {
      if(err) {
        res.send(err);
      }
      res.json({message: "FoodTruck info updated" });
    });
  });
});

// Remove a foodtruck and it's reviews
// '/v1/foodtruck/:id' - Delete
api.delete('/:id', authenticate, (req, res) => {
  FoodTruck.findById(req.params.id, (err, foodtruck) => {
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
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if(err) {
        res.status(500).send(err);
        return;
      }
      Review.remove({ foodtruck: req.params.id }, (err, review) => {
        if(err) {
          res.send(err);
        }
        res.json({message: "FoodTruck and Reviews removed OK" });
      });
    });
  });
});
  

// add review for a specific foodtruck id
// '/v1/foodtruck/reviews/add/:id'
api.post('/reviews/add/:id', authenticate, (req, res) => {
  FoodTruck.findById(req.params.id, (err, foodtruck) => {
    if(err) {
      res.send(err);
    }
    let newReview = new Review();
    newReview.title = req.body.title;
    newReview.text = req.body.text;
    newReview.foodtruck = foodtruck._id; //link the foodtruck id to the review
    newReview.save((err, review) => {
      if(err) {
        res.send(err);
      }
      // we have to push the object to the end of the array of reviews
      // and we have to save it!
      foodtruck.reviews.push(newReview);
      foodtruck.save(err => {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Food truck review saved!' });
      });
    });
  });
});

//get reviews for a specific food truck id
// '/v1/foodtruck/reviews/:id'
api.get('/reviews/:id', (req, res) => {
  Review.find({ foodtruck: req.params.id }, (err, reviews) => {
    if(err) {
      res.send(err);
    }
    res.json(reviews);
  });
});

  return api;  /////////////////

}
