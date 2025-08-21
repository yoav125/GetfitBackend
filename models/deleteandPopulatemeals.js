// deleteAndPopulateMeals.js

const mongoose = require('mongoose');
const Meal       = require('./meal');        // adjust path if needed
  // your array of meal definitions
const Ingredient = require('./ingredients'); // to look up IDs

mongoose.connect('mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // 1) Delete existing meals
  await Meal.deleteMany({});
  console.log('✅ All existing meals have been deleted.');

  // 2) Fetch ingredients once
  const ingredients = await Ingredient.find({});
  
  // 3) Re‐map and insert every meal
  let count = 0;
  for (const mealDef of rawMeals) {
    // build `ingredientObjects` as we discussed—carrying unitName in both branches
    const ingredientObjects = mealDef.ingredients.map(({ name, amountInGrams, unitsAmount, unitName, note }) => {
      const match = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (!match) return null;
      const obj = { ingredientId: match._id };
      if (amountInGrams != null) {
        obj.amountInGrams = amountInGrams;
        if (unitName) obj.unitName = unitName.trim();
      }
      if (unitsAmount != null) {
        obj.unitsAmount = unitsAmount;
        if (unitName)    obj.unitName = unitName.trim();
      }
      if (note) obj.note = note;
      return obj;
    }).filter(Boolean);

    if (!ingredientObjects.length) continue;
    await Meal.create({
      name:       mealDef.name,
      image:      mealDef.image,
      ingredients: ingredientObjects,
      proteinTags: [], // your tag logic here
      carbTags:    [],
    });
    count++;
  }

  console.log(`✅ Re‐populated ${count} meals.`);
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});
