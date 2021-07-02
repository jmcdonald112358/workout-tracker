const router = require('express').Router();
const mongoose = require('mongoose');
const db = require('../models');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutTracker", {
   useNewUrlParser: true,
   useFindAndModify: false
});

//get existing data
router.get('/api/workouts', (req, res) => {
   db.Workout.find({})
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json(err));
});

//update a workout
router.put('/api/workouts/:id', (req, res) => {
   db.Workout.updateOne({_id: req.params.id}, {$push: req.body});
});

//add a workout
router.post('/api/workouts', (req, res) => {
   db.Workout.create(req.body)
   .then((data) => res.json(data))
   .catch((err) => res.status(400).json(err));
});

//aggregate last 7 workouts
router.get('/api/workouts/stats', (req, res) => {
   db.Workout.aggregate([
      {
         $addFields: {
            totalDuration: {$sum: 'exercises.duration'},
            totalWeight: {$sum: '$exercises.weight'},
            totalSets: {$sum: '$exercises.sets'},
            totalReps: {$sum: '$exercises.reps'},
            totalDistance: {$sum: '$exercises.distance'}
         },
      },
      {$sort: {_id: -1}},
      {$limit: 7},
   ])
   .then((data) => res.json(data))
   .catch((err) => res.status(400).json(err));
});

module.exports = router;