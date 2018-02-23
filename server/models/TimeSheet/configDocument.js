var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configDocumentSchema = new Schema({
  config:{ type: String, required: true },
  userIds:{ type: Array },
  lag:{ type: Number },
  disabled: { type: Boolean }
});

module.exports = {configDocumentSchema};
