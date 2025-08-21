const mongoose = require('mongoose');
const Ingredient = require('./ingredients');  // Adjust the path if needed

// MongoDB connection
mongoose.connect('mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Clean Unified Ingredient List
const ingredientList = [
  { name: 'Eggs', carbsPer100g: 1, proteinPer100g: 11 },
  { name: 'Cheese', carbsPer100g: 3.4, proteinPer100g: 12 },
  { name: 'Spinach', carbsPer100g: 3.6, proteinPer100g: 0 },
  { name: 'Shrimp', carbsPer100g: 0, proteinPer100g: 24 },
  { name: 'Quinoa', carbsPer100g: 21, proteinPer100g: 0 },
  { name: 'Cucumber', carbsPer100g: 4, proteinPer100g: 0 },
  { name: 'Chicken Breast', carbsPer100g: 0, proteinPer100g: 31 },
  { name: 'Peas',       carbsPer100g: 14, proteinPer100g: 5.4 },


  { name: 'Broccoli', carbsPer100g: 7, proteinPer100g: 0 },
  { name: 'Fruit', carbsPer100g: 14, proteinPer100g: 0 },
 
  { name: 'Avocado', carbsPer100g: 9, proteinPer100g: 0 },
  { name: 'Lettuce', carbsPer100g: 2, proteinPer100g: 0 },
  { name: 'Bread', carbsPer100g: 43, proteinPer100g: 13 },


  { name: 'Walnuts', carbsPer100g: 14, proteinPer100g: 0 },
  { name: 'Meat', carbsPer100g: 0, proteinPer100g: 28 },
  { name: 'Asparagus', carbsPer100g: 4, proteinPer100g: 0 },
 { name: 'Almonds', carbsPer100g: 22, proteinPer100g: 21 },
{ name: 'Tofu', carbsPer100g: 2, proteinPer100g: 16 },
{ name: 'Pasta', carbsPer100g: 25, proteinPer100g: 5 },
{ name: 'Kale', carbsPer100g: 9, proteinPer100g: 3 },
{ name: 'Arugula', carbsPer100g: 3.7, proteinPer100g: 2.6 },
{ name: 'Radish', carbsPer100g: 3.4, proteinPer100g: 1 },


  { name: 'Chia Seeds', carbsPer100g: 42, proteinPer100g: 0 },

  { name: 'Green Beans', carbsPer100g: 7, proteinPer100g: 0 },
  { name: 'Zucchini', carbsPer100g: 3, proteinPer100g: 1.2 },
  
  { name: 'Peanut Butter', carbsPer100g: 20, proteinPer100g: 25 },

  { name: 'Granola', carbsPer100g: 64, proteinPer100g: 6 },
  { name: 'Berries (Mixed)', carbsPer100g: 11, proteinPer100g: 0 },
  { name: 'Bell Peppers', carbsPer100g: 6, proteinPer100g: 1 },
  { name: 'Turkey Breast', carbsPer100g: 0, proteinPer100g: 31 },

{ name: 'Tortilla', carbsPer100g: 50, proteinPer100g: 8 },

  { name: 'Couscous', carbsPer100g: 23, proteinPer100g: 3.8 },
  { name: 'Roasted Vegetables', carbsPer100g: 6, proteinPer100g: 1 },

  { name: 'Yogurt', carbsPer100g: 4, proteinPer100g: 10 },

  { name: 'Rice', carbsPer100g: 28, proteinPer100g: 0 },
  { name: 'Grilled Asparagus', carbsPer100g: 4, proteinPer100g: 2.2 },
  { name: 'Fish', carbsPer100g: 0, proteinPer100g: 29 },
  { name: 'Cod Fillet', carbsPer100g: 0, proteinPer100g: 18 },
  { name: 'Bread', carbsPer100g: 43, proteinPer100g: 13 },
  { name: 'Sole', carbsPer100g: 0, proteinPer100g: 20 },
  { name: 'Potatoes', carbsPer100g: 15, proteinPer100g: 2.5 },
  { name: 'Green Peas', carbsPer100g: 14, proteinPer100g: 5.4 },
{ name: 'Chickpeas', carbsPer100g: 27, proteinPer100g: 9 },
{ name: 'Carrots', carbsPer100g: 10, proteinPer100g: 1 },
{ name: 'Broccoli', carbsPer100g: 7, proteinPer100g: 3 },

  { name: 'Tomatoes', carbsPer100g: 3.9, proteinPer100g: 1.2 },

  { name: 'Oatmeal', carbsPer100g: 12, proteinPer100g: 2.5 },
  { name: 'Celery', carbsPer100g: 3, proteinPer100g: 0.7 },
  { name: 'Crackers', carbsPer100g: 64, proteinPer100g: 8 },



];

// Populate function
async function populateIngredients() {
  for (const ingredient of ingredientList) {
    try {
      const existing = await Ingredient.findOne({ name: ingredient.name });
      if (existing) {
        console.log(`✅ ${ingredient.name} already exists, skipping...`);
      } else {
        await Ingredient.create(ingredient);
        console.log(`➕ Inserted ${ingredient.name}`);
      }
    } catch (err) {
      console.error(`❌ Error inserting ${ingredient.name}:`, err);
    }
  }
  mongoose.connection.close();
}

populateIngredients();
