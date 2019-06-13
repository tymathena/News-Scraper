var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({

  title: {
    type: String,
    trim: true,
    required: "No title provided"
  },

  link: {
    type: String,
    trim: true
  },

  note: {
    type: String,
    trim: true
  },

  timeScraped: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("savedArticle", ArticleSchema);

// Export the User model
module.exports = Article;
