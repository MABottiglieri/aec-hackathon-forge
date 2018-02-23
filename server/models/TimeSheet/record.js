var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recordSchema = new Schema({
  //richiesti per tabella adHoc
  company:{ type: String, maxlength: 5, minlength: 5, required: true },
  userId:{ type: String, maxlength: 15, required: true },
  jobId:{ type: String, maxlength: 15, required: true },
  activityId:{ type: String, maxlength: 15, required: true, trim: true },
  dateTimesheet:{ type: Date,required: true, default: new Date() },
  dateRecord:{ type: Date, required: [true, 'Why no dateRecord?'] },
  hours:{ type: Number, required: true },
  adHocCpccchk:{ type: String, required: true, default: "aaaaaaaaaa"},
  //richiesti per WebApp TimeSheet
  dayId: { type: String, required: true },
  area: { type: String, required: true, trim: true },
  notes:{ type: String },
  editable: { type: Boolean, required:true, default: true }
});

module.exports = {recordSchema};
