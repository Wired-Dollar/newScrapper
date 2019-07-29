var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// schema for notes
var NoteSchema = new Schema({
//  name the note
  title: String,
//  note substance
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;