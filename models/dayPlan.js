const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Preference', required: true },
  dayNumber: { type: Number, required: true },
  mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
});

module.exports = mongoose.model('DayPlan', dayPlanSchema);
