var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// new schema
var ArticleSchema = new Schema({
//   article title
    title: {
    type: String,
    required: true
  },
//   website link
  link: {
    type: String,
    required: true
  },
//   links our notes
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// puts it all together
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
