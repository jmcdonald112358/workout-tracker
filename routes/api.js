const router = require('express').Router();
const db = require('../models');

module.exports = (app) => {
   //get existing data
   app.get('/api/workouts', (req, res) => {
      db.Workout.aggregate(
         [{
            $addFields: { totalDuration: {$sum: '$exercises.duration'}}
         }]
      )
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json(err));
   });

   //update a workout
   app.put('/api/workouts/:id', (req, res) => {
      let id = req.params.id
      if (req.body.type == "cardio") {
         db.Workout.findByIdAndUpdate(id, { $push: { exercises: req.body } })
            .then(WorkoutDB => {
               console.log(WorkoutDB)
               res.json(WorkoutDB);
            })
            .catch(err => {
               res.json(err);
            })
      } else if (req.body.type === "resistance") {
         db.Workout.findByIdAndUpdate(id, { $push: { exercises: req.body } })
            .then(workoutsDB => {
               res.json(workoutsDB);
            })
            .catch(err => {
               res.json(err);
            })
      }
   })

   //add a workout
   const id = location.search.split("=")[1];
   app.post('/api/workouts' + id, (req, res) => {
      db.Workout.create(req.body)
         .then((data) => res.json(data))
         .catch((err) => res.status(400).json(err));
   });

   //aggregate last 7 workouts
   app.get('/api/workouts/range', (req, res) => {
      db.Workout.aggregate([
         {
            $addFields: {
               totalDuration: { $sum: '$exercises.duration' },
               totalWeight: { $sum: '$exercises.weight' },
               totalSets: { $sum: '$exercises.sets' },
               totalReps: { $sum: '$exercises.reps' },
               totalDistance: { $sum: '$exercises.distance' }
            },
         },
         { $sort: { _id: -1 } },
         { $limit: 7 },
      ])
         .then((data) => res.json(data))
         .catch((err) => res.status(400).json(err));
   });
}