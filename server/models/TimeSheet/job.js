var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  job: {
    type: String,
    required: true
  },
  pl: {
    type: String,
    required: true
  },
  cl: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  activities: {
    type: Array,
    required: true
  }
});

module.exports = {jobSchema};
// var job = mongoose.model('jobs', jobSchema); //Test diventa la Collection "jobs" in MongoDB
// module.exports = {job};
