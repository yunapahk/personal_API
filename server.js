///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("Connected to mongoose"))
  .on("close", () => console.log("Disconnected from mongoose"))
  .on("error", (error) => console.log(error));

// ///////////////////////////////
// MODELS
// ////////////////////////////////
const movieSchema = new mongoose.Schema({
  title: String,
  director: String,
  year: Number,
  image: String,

});

const Movie = mongoose.model("Movie", movieSchema);

//////////////////////////////
// Middleware
//////////////////////////////
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.json({hello: "world"})
})

// INDEX - GET - /movie - gets all movies
app.get("/movie", async (req, res) => {
  try {
    // fetch all movies from database
    const movie = await Movie.find({});
    // send json of all movies
    res.json(movie);
  } catch (error) {
    // send error as JSON
    res.status(400).json({ error });
  }
});

// CREATE - POST - /movie - create a new movie
app.post("/movie", async (req, res) => {
  try {
      // create the new movie
      const movie = await Movie.create(req.body)
      // send newly created movie as JSON
      res.json(movie)
  }
  catch(error){
      res.status(400).json({ error })
  }
})

// SHOW - GET - /movie/:id - get a single movie
app.get("/movie/:id", async (req, res) => {
  try {
    // get a movie from the database
    const movie = await Movie.findById(req.params.id);
    // return the movie as json
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// UPDATE - PUT - /movie/:id - update a single movie
app.put("/movie/:id", async (req, res) => {
  try {
    // update the movie
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // send the updated movie as json
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// DESTROY - DELETE - /movie/:id - delete a single movie
app.delete("/movie/:id", async (req, res) => {
  try {
      // delete the movie
      const movie = await Movie.findByIdAndDelete(req.params.id)
      // send deleted movie as json
      res.status(204).json(movie)
  } catch(error){
      res.status(400).json({error})
  }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Iron Man says ily ${PORT}`));
