const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weightSchema = new Schema({
  currentWeight: { type: Number, required: true },

}, { timestamps: true });

const Weight = mongoose.model('Weight', weightSchema);
module.exports = Weight;
