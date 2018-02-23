var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// "trim: true" rimuove gli spazi prima e dopo il testo
var uncomplete_user_Schema = new Schema({
  name: { type: String, required: true, trim: true },
  surname: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  userId: { type: String, required: true, trim: true, unique: true },
  date: { type: Date, required: true, default: Date.now() },
  company: [{ type: String, required: true, trim: true }],
  area: { type: String, required: true, trim: true },
  imageProfile: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 64 },
  email: { type: String, required: true, trim: true },
  userRole: [{ type: String, required: true, trim: true }],
  updated: { type:Boolean, require:true}
});

module.exports = {uncomplete_user_Schema};
// var user = mongoose.model('users', userSchema); //Test diventa la Collection "users" in MongoDB
// module.exports = {user};
