var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var daySchema = new Schema({
  dayId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  dataRows: {
    type: Array,
    required: true,
    default: []
  },
  editable: {
    type: Boolean,
    required:true
  }
});

module.exports = {daySchema};
// var day = mongoose.model('days', daySchema); //Test diventa la Collection "days" in MongoDB
// module.exports = {day};
