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

const PORT = process.env.PORT || 3000;

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

//Initial scrape

const scrape = (req, res) => {


  axios.get("https://www.theonion.com/").then(function (response) {

      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("section.content-meta__headline__wrapper").each(function (i, element) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
              .children("a")
              .text();
          console.log(result.title)
          result.link = $(this)
              .children("a")
              .attr("href");

          // Create a new Article using the `result` object built from scraping
          if (result.title !== "Continue Reading") {
              db.article.create(result)
                  .then(dbArticle => {
                      // View the added result in the console
                      console.log(dbArticle);
                  })
                  .catch(err => {
                      // If an error occurred, log it
                      console.log(err);
                  });
          }
      });

      // Send a message to the client
      res.send("Scrape Complete");
  });
}

scrape()

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
