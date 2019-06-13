const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

console.log("hello")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/onionscraper", { useNewUrlParser: true });

// Routes
require("./routes/api-routes.js")(app)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
