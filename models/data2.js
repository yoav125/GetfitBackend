// models/contact.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, required: true }, // String is safer for phone numbers
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
