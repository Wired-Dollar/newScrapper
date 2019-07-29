// dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
var app = express();
// req handlebars for styling
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// log everything
app.use(logger("dev"));
// our server is hosted on Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// Mongoose holds our database
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
// Cheerio scrapes the local news from the KC star
app.get("/scrape", function(req, res) {

    axios.get("https://www.kansascity.com/news/local/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("article h2").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })

        .catch(function(err) {
            console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })

    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      res.json(err);
    });
});
// this starts up our server and the magic can begin
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
