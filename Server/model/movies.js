const mongoose = require('mongoose');

// const movieSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   releaseDate: {
//     type: Date,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   locations: [
//     {
//       city: {
//         type: String, // City where the theater is located
//         required: true,
//       },
//       theater: {
//         type: String, // Name of the theater
//         required: true,
//       },
//       showtimes: {
//         type: [String], // Array of showtimes
//         required: true,
//       },
//       seats: {
//         type: [String], // Array of seat labels available in the theater
//         required: true,
//       },
//     },
//   ],
// });
// const Movie = mongoose.model('Movie', movieSchema);

// module.exports = Movie;

// Create the Movie model

const actorSchema = new mongoose.Schema({
  act_img: { type: String, required: true },
  act_name: { type: String, required: true },
});

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  thumbnail: { type: String, required: true },
  cover: { type: String, required: true },
  type: { type: String, required: true },
  about: { type: String, required: true },
  language: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  votes: { type: String, required: true },
  actors: [actorSchema],
}, { timestamps: true });

 let    Movies = mongoose.model('Movie', movieSchema);
 module.exports=Movies
