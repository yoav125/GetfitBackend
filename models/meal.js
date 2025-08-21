const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  amountInGrams: { type: Number }, // For gram-based ingredients
  unitsAmount: { type: Number },   // For unit-based ingredients
  unitName: { type: String },      // The unit (eggs, pieces, slices, apple etc.)
  note: { type: String }           // Optional special instruction (e.g. 'only one yolk')
});

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [ingredientSchema],
  proteinTags: [{ type: String }],
  carbTags: [{ type: String }],
  image: { type: String }
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;
