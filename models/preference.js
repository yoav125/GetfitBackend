const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Data' },  // assuming your user data collection is named 'Data'
  proteins: [String],
  carbs: [String]
});

module.exports = mongoose.model('Preference', preferenceSchema);
