const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

let currentUserInfo;

module.exports = app => {
  //Runs scraping script
  app.get("/api/scrape", (req, res) => {
    axios.get("https://www.theonion.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("a.js_link").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("h1")
          .text();
        console.log(result.title);
        result.link = $(this).attr("href");

        // Create a new Article using the `result` object built from scraping
        if (result.title !== "Continue Reading") {
          db.article
            .create(result)
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
  });

  app.get("/api/articles", (req, res) => {
    db.article.find({}).then(articles => {
      res.json(articles);
    });
  });

  app.get("/api/articles/:id", (req, res) => {
    db.article
      .findOne({
        _id: req.params.id
      })
      .then(article => {
        res.json(article);
      });
  });

  app.get("/api/saved", (req, res) => {
    db.savedArticle
      .find({})
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/saved", (req, res) => {
    const articleWithoutId = {
      title: req.body.title,
      link: req.body.link,
      note: req.body.note
    };

    db.savedArticle
      .create(articleWithoutId)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/articles/addNote/:id", (req, res) => {
    db.article
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            note: req.body.note
          }
        },
        { new: true }
      )
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
};
