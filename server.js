///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3500, DATABASE_URL } = process.env;
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
const StockSchema = new mongoose.Schema({
  name: String,
  title: String,
  image: String
});

const Stock = mongoose.model("Stock", StockSchema);

// ///////////////////////////////
// // MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});

// INDEX - GET - /stocks - gets all stocks
app.get("/stock", async (req, res) => {
    try {
      // fetch all people from database
      const people = await Stock.find({});
      // send json of all stocks
      res.json(people);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });

// CREATE - POST - /stock - create a new person
app.post("/stock", async (req, res) => {
    try {
        // create the new person
        const person = await Stock.create(req.body)
        // send newly created person as JSON
        res.json(stock)
    }
    catch(error){
        res.status(400).json({ error })
    }
});


// SHOW - GET - /stock/:id - get one stock by id
app.get("/stock/:id", async (req, res) => {
        try {
            // fetch all stocks from database
            const stock = await Stock.findById(req.params.id);
        } catch (error) {
            res.status(400).json({ error });
    }
});

// UPDATE ROUTE
app.put("/stock/:id", async (req, res) => {
  try {
    // send all people
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        });
    res.json(
      await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// DESTROY - DELETE - /people/:id - delete a stock person
app.delete("/stock/:id", async (req, res) => {
    try {
        // delete the person
        const stock = await Stock.findByIdAndDelete(req.params.id)
        // send deleted stock as json
        res.status(204).json(stock)
    } catch(error){
        res.status(400).json({error})
    }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
