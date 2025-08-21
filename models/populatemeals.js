const mongoose = require('mongoose');
const Meal = require('./meal');
const Ingredient = require('./ingredients');

mongoose.connect('mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

const findIngredientId = (ingredients, name) => {
  const match = ingredients.find(i =>
    i.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (!match) {
    console.warn(`Ingredient not found: ${name}`);
    return null;
  }
  return match._id;
};
const unitIngredients = ['Bread', 'Fruit', 'Walnuts','Eggs'];

const proteinSources = [
  'Eggs',
  'Chicken Breast',
  'Fish',
  'Shrimp',
  'Turkey Breast',
  'Cheese',
  'Yogurt',
  'Tofu',
  'Meat'

];
const carbSources = [
  'Quinoa',
  'Bread',
  'Tortilla',
  'Fruit',
  'Pasta',
  'Couscous',
  'Rice',
  'Potatoes',
  'Oatmeal',
  'Granola',
  'Strawberries',
  'Berries',
  'Chickpeas',
  'Carrots',
  'Green Beans',

];

const rawMeals = [
{
  name: 'Egg White Omelet with Cottage Cheese up to 5% fat and Spinach',
  image: 'normal1.webp',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Shrimp & Quinoa Salad',
  image: 'normal2.webp',
  ingredients: [
    { name: 'Shrimp', amountInGrams: 120 },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Lunch: Grilled Chicken Breast with Sweet Potato and Broccoli',
  image: 'normal3.webp',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Cottage Cheese and Apple Slices',
  image: 'normal4.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' }
  ]
},
{
  name: 'Tuna Salad with Avocado and Lettuce',
  image: 'normal5.webp',
  ingredients: [
    { name: 'Fish',  unitName: 'Tuna', amountInGrams: 120 },
    { name: 'Avocado', amountInGrams: 100 },
    { name: 'Lettuce', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Ricotta Cheese with Strawberries and Walnuts',
  image: 'normal6.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', amountInGrams: 300, unitName: 'Strawberries' },
    { name: 'Walnuts', unitsAmount: 5, unitName: 'walnuts' }
  ]
},
{
  name: 'Grilled Sirloin Steak with Mashed Sweet Potatoes and Asparagus',
  image: 'normal8.webp',
  ingredients: [
    { name: 'Meat', unitName:'Sirolin Steak', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Baked Tilapia with Green Beans and Wild Rice',
  image: 'normal10.webp',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia', amountInGrams: 120 },
    { name: 'Green Beans', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Rice', amountInGrams: 100 }
  ]
},
{
  name: 'Quinoa & Salmon Salad with Sweet Potatoes',
  image: 'normal13.webp',
  ingredients: [
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Fish', unitName:'Salmon', amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 }
  ]
},
{
  name: 'Greek Yogurt Parfait with Granola and Berries',
  image: 'normal14.webp',
  ingredients: [
    { name: 'Yogurt', amountInGrams: 220 },
    { name: 'Granola', amountInGrams: 35 },
    { name: 'Fruit', amountInGrams: 250, unitName: 'Berries' }
  ]
},
{
  name: 'Shrimp Stir-Fry with Wild Rice and Bell Peppers',
  image: 'normal15.webp',
  ingredients: [
    { name: 'Shrimp', amountInGrams: 120 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Bell Peppers', unitsAmount: 1, unitName: 'bell pepper' }
  ]
},
{
  name: 'Turkey Breast & Whole Wheat Toast with Avocado',
  image: 'normal16.webp',
  ingredients: [
    { name: 'Turkey Breast', amountInGrams: 100 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Avocado', amountInGrams: 100 }
  ]
},
{
  name: 'Cottage Cheese & Pineapple Bowl',
  image: 'normal17.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', amountInGrams: 200,   unitName: 'between 100 to 200 grams of Pineaple Bowl' }
  ]
},
{
  name: 'Grilled Chicken Breast with Couscous and Roasted Vegetables',
  image: 'normal18.webp',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Roasted Vegetables', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Banana & Low-fat Yogurt with Chia Seeds',
  image: 'normal19.webp',
  ingredients: [
    { name: 'Fruit', unitsAmount: 1, unitName: 'Banana' },
    { name: 'Yogurt', amountInGrams: 220 },
    { name: 'Chia Seeds', amountInGrams: 10 }
  ]
},
{
  name: 'Grilled Chicken Breast with Quinoa and Steamed Broccoli',
  image: 'norma23.webp',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Yellow Cheese with Apple Slices',
  image: 'normal24.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 100 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' }
  ]
},
{
  name: 'Tilapia with Rice and Grilled Asparagus',
  image: 'normal25.webp',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia', amountInGrams: 120 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},

{
  name: 'Scrambled Eggs with Whole Wheat Bread',
  image: 'vegetarian1.webp',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Mid-Morning Snack: Cottage Cheese with Strawberries',
  image: 'vegetarian2.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', amountInGrams: 300, unitName: 'Strawberries' }
  ]
},
{
  name: 'Meal: Grilled Tuna with Quinoa and Asparagus',
  image: 'vegetarian3.webp',
  ingredients: [
    { name: 'Fish', unitName:'Tuna', amountInGrams: 120 },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Cheese Cubes with Apple Slices and Chickpeas',
  image: 'vegetarian4.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'apple' },
    { name: 'Chickpeas', amountInGrams: 100 }
  ]
},
{
  name: 'Grilled White Fish with Mashed Sweet Potatoes and Spinach',
  image: 'vegetarian5.png',
  ingredients: [
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Fish', unitName:'White Fish', amountInGrams: 120 }
  ]
},
{
  name: 'Omelet with Cottage Cheese and Whole Grain Toast',
  image: 'vegetarian6.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Greek Yogurt with Peach Slices',
  image: 'vegetarian7.webp',
  ingredients: [
    { name: 'Yogurt', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Peach' }
  ]
},
{
  name: 'Flatbread with Cheese Cubes and Fresh Mint',
  image: 'vegetarian9.webp',
  ingredients: [
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Cheese', amountInGrams: 220 }
  ]
},
{
  name: 'Grilled Tilapia Fish with Mashed Potatoes and Green Beans',
  image: 'vegetarian10.webp',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia',amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Green Beans', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Scrambled Eggs, Fried Eggs, and Toast',
  image: 'vegetarian11.webp',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Cottage Cheese with Fresh Strawberries',
  image: 'vegetarian12.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', amountInGrams: 300, unitName: 'Strawberries' }
  ]
},
{
  name: 'Greek Yogurt with Peach Slices',
  image: 'vegetarian15.webp',
  ingredients: [
    { name: 'Yogurt', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Peach' }
  ]
},
{
  name: 'Cottage Cheese with Strawberries',
  image: 'normal22.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', amountInGrams: 300, unitName: 'Strawberries' }
  ]
},
{
  name: 'Turkey Breast with Oatmeal and Almonds',
  image: 'normal600.webp',
  ingredients: [
    { name: 'Turkey Breast', amountInGrams: 100 },
    { name: 'Oatmeal', amountInGrams: 40 },
    { name: 'Almonds', amountInGrams: 10 }
  ]
},
{
  name: 'Scrambled Eggs with Whole Wheat Toast',
  image: 'vegetarian20.webp',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Grilled Fish Fillet with Rice and Green Beans',
  image: 'vegetarian19.webp',
  ingredients: [
    { name: 'Fish', unitName:'Fish Fillet', amountInGrams: 120 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Green Beans', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Grilled Chicken Breast with Quinoa, Broccoli and Asparagus',
  image: 'vegetarian22.webp',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 100 }
  ]
},
{
  name: 'Tortilla with Cheese up to 5% fat',
  image: 'vegetarian23.webp',
  ingredients: [
    { name: 'Tortilla', amountInGrams: 1 },
    { name: 'Cheese', amountInGrams: 220 }
  ]
},
{
  name: 'Grilled Tilapia with Mashed Sweet Potato and Green Beans',
  image: 'vegetarian24.webp',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia' ,amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Green Beans', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Grilled Fish Fillet with Couscous and Roasted Vegetables',
  image: 'vegetarian17.webp',
  ingredients: [
    { name: 'Fish',unitName:'Fish Fillet' ,amountInGrams: 120 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Roasted Vegetables', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Yellow Cheese up to 5% fat with Pear Slices',
  image: 'vegetarian18.webp',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Pear' }
  ]
},
{
  name: 'Greek Yogurt with Banana Slices',
  image: 'vegetarian21.webp',
  ingredients: [
    { name: 'Yogurt', amountInGrams: 220 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Banana' }
  ]
},

{
  name: 'Grilled Tofu with Broccoli and light Bread',
  image: 'breakfast1.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Scrambled Eggs on Toast with Bell Peppers',
  image: 'breakfast2.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tofu Cubes with Spinach and Apple Slices',
  image: 'breakfast3.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' }
  ]
},
{
  name: 'Tofu with Kiwi and Baby Carrots',
  image: 'breakfast4.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Kiwi' },
    { name: 'Carrots', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tofu with Spinach and Couscous',
  image: 'breakfast5.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Couscous', amountInGrams: 100 }
  ]
},
{
  name: 'Scrambled Eggs, Quinoa & Peppers',
  image: 'breakfast6.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tofu Cubes, Lettuce & Tortilla',
  image: 'breakfast7.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Lettuce', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Scrambled Eggs with Peppers in Tortilla',
  image: 'breakfast8.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Grilled Salmon without oil, Lettuce & Bread',
  image: 'breakfast9.png',
  ingredients: [
    { name: 'Fish', unitName:'Salmon' ,amountInGrams: 120 },
    { name: 'Lettuce', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Tuna Sandwich with Tomatoes',
  image: 'breakfast10.png',
  ingredients: [
    { name: 'Fish', amountInGrams: 120 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Tomatoes', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tuna Cubes with Bell Peppers and Tortilla',
  image: 'breakfast11.png',
  ingredients: [
    { name: 'Fish',unitName:'Tuna' ,amountInGrams: 120 },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Tuna Cubes with Broccoli and Tortilla',
  image: 'breakfast12.png',
  ingredients: [
    { name: 'Fish', unitName:'Tuna' ,amountInGrams: 120 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Tuna Cubes with Apple',
  image: 'breakfast13.png',
  ingredients: [
    { name: 'Fish', unitName:'Tuna', amountInGrams: 120 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' }
  ]
},
{
  name: 'Scrambled Eggs with Bread and Broccoli',
  image: 'breakfast14.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Scrambled Eggs with Bread and Spinach',
  image: 'breakfast15.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Fried Eggs with Spinach and Tomato',
  image: 'breakfast17.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tomatoes', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Scrambled Eggs with Spinach and Quinoa',
  image: 'breakfast18.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Quinoa', amountInGrams: 100 }
  ]
},
{
  name: 'Scrambled Eggs with Quinoa and Tomato',
  image: 'breakfast19.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Tomatoes', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Scrambled Eggs with Spinach and Tortilla',
  image: 'breakfast20.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Scrambled Eggs with Bell Peppers and Tortilla',
  image: 'breakfast21.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},

{
  name: 'Mozzarella up to 5% fat with Spinach',
  image: 'breakfast22.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tofu with Bread and Broccoli',
  image: 'breakfast23.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Broccoli', amountInGrams: 100, note: 'between 100 to 200 grams' },
    { name: 'Bell Peppers', amountInGrams: 100, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Cheese with Bread and Spinach',
  image: 'breakfast24.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Spinach', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Cheese with Broccoli, Apple and Tomato',
  image: 'breakfast25.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Broccoli', amountInGrams: 100,note: 'between 100 to 200 grams'  },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' },
    { name: 'Tomatoes', amountInGrams: 100, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Tofu with Baby Carrots and Banana',
  image: 'breakfast26.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Carrots', amountInGrams: 100 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Banana' }
  ]
},
{
  name: 'Ricotta up to 5% fat with Broccoli and Couscous',
  image: 'breakfast27.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Couscous', amountInGrams: 100 }
  ]
},
{
  name: 'Ricotta up to 5% fat with Red Bell Pepper and Couscous',
  image: 'breakfast28.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Couscous', amountInGrams: 100 }
  ]
},
{
  name: 'Yellow Cheese up to 5% fat with Broccoli and Tortilla',
  image: 'breakfast29.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Yellow Cheese up to 5% fat with Red Bell Pepper and Tortilla',
  image: 'breakfast30.png',
  ingredients: [
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Bell Peppers', amountInGrams: 200, note: 'between 100 to 200 grams' },
    { name: 'Tortilla', amountInGrams: 50 }
  ]
},
{
  name: 'Beef Filet with Baked Potato and Broccoli',
  image: 'lunch2.png',
  ingredients: [
    { name: 'Meat',unitName:'Beff Filet', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},
{
  name: 'Beef Filet with light Bread and Tomatoes',
  image: 'lunch3.png',
  ingredients: [
    { name: 'Meat', unitName:'Beef Filet',amountInGrams: 100 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Tomatoes', amountInGrams: 200, note: 'between 100 to 200 grams' }
  ]
},

{
  name: 'Grilled Chicken Breast with Sweet Potatoes and Salad',
  image: 'lunch4.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Grilled Chicken Breast with Pasta, light Bread and Salad',
  image: 'lunch5.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Pasta', amountInGrams: 100 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Chicken Breast with Spinach and light Bread',
  image: 'lunch6.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Chicken Breast with Apple and Salad',
  image: 'lunch7.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Chicken Breast with Rice and Salad',
  image: 'lunch8.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tortilla with Tofu and Apple',
  image: 'lunch9.png',
  ingredients: [
    { name: 'Tortilla', amountInGrams: 50 },
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'apple' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tofu with Potato and Salad',
  image: 'lunch10.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tofu with Sweet Potato and Broccoli',
  image: 'lunch11.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Tofu with Pasta and Broccoli',
  image: 'lunch12.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Pasta', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Tilapia Fish with Potato and Salad',
  image: 'lunch13.png',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia', amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tuna Steak with Sweet Potato and Broccoli',
  image: 'lunch14.png',
  ingredients: [
    { name: 'Fish', unitName:'Tuna', amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Flounder Fish with Potato and Broccoli',
  image: 'lunch15.png',
  ingredients: [
    { name: 'Fish', unitName:'Flounder Fish', amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Salmon with Rice, Apple and Broccoli',
  image: 'lunch16.png',
  ingredients: [
    { name: 'Fish', unitName:'Salmon' ,amountInGrams: 120 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Eggs with Potato and Salad',
  image: 'lunch17.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Scrambled Eggs with Sweet Potato and Spinach',
  image: 'lunch18.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Apple and Broccoli',
  image: 'lunch19.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apple' },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Rice and Broccoli',
  image: 'lunch20.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Bread and Salad',
  image: 'lunch21.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Beef Steak with Green Beans and Bread',
  image: 'lunch22.png',
  ingredients: [
    { name: 'Meat', unitName:'Beef Steak' ,amountInGrams: 100 },
    { name: 'Green Beans', amountInGrams: 200 },
    { name: 'Bread', unitsAmount: 3, unitName: 'pieces of bread' }
  ]
},
{
  name: 'Boiled Eggs with Peach and Salad',
  image: 'lunch24.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Peach' },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},

{
  name: 'Tofu with Orange, Apricot and Broccoli',
  image: 'lunch25.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Fruit', unitsAmount: 1, unitName: 'orange' },
    { name: 'Fruit', unitsAmount: 1, unitName: 'Apricot' },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Rice, Cheese Cubes and Salad',
  image: 'lunch26.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Cheese', amountInGrams: 220 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Scrambled Eggs with Rice and Salad',
  image: 'lunch27.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tofu with Rice and Broccoli',
  image: 'lunch28.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Tilapia Fish with Rice and Salad',
  image: 'lunch29.png',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia',amountInGrams: 120 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Beef Steak with Rice and Broccoli',
  image: 'lunch30.png',
  ingredients: [
    { name: 'Meat', unitName:'Beef Steak',amountInGrams: 100 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Chicken Breast with Rice and Broccoli',
  image: 'lunch31.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Potatoes and Salad',
  image: 'lunch32.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tofu with Potato and Broccoli',
  image: 'lunch33.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Tuna Steak with Potato and Salad',
  image: 'lunch34.png',
  ingredients: [
    { name: 'Fish', unitName:'Tuna', amountInGrams: 120 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Beef Steak with Potato and Broccoli',
  image: 'lunch35.png',
  ingredients: [
    { name: 'Meat', unitName:'Beef Steak', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},
{
  name: 'Chicken with Potato and Asparagus',
  image: 'lunch36.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 200 }
  ]
},
{
  name: 'Tuna Steak with Couscous, Potato and Salad',
  image: 'lunch37.png',
  ingredients: [
    { name: 'Fish',unitName:'Tuna' ,amountInGrams: 120 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 }
  ]
},
{
  name: 'Lean Beef with Couscous and Spinach',
  image: 'lunch38.png',
  ingredients: [
    { name: 'Turkey Breast', amountInGrams: 100 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200 }
  ]
},
{
  name: 'Tuna Steak with Couscous and Salad',
  image: 'lunch39.png',
  ingredients: [
    { name: 'Fish', unitName:'Tuna',amountInGrams: 120 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Chicken Breast with Quinoa and Kale',
  image: 'lunch40.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Quinoa', amountInGrams: 100 },
    { name: 'Kale', amountInGrams: 200 }
  ]
},
{
  name: 'Tofu with Couscous, Spinach and Asparagus',
  image: 'lunch41.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200 },
    { name: 'Asparagus', amountInGrams: 200 }
  ]
},
{
  name: 'Scrambled Eggs with Couscous, Spinach and Radish',
  image: 'lunch42.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Spinach', amountInGrams: 200 },
    { name: 'Radish', amountInGrams: 200 }
  ]
},
{
  name: 'Chicken Breast with Couscous and Salad',
  image: 'lunch43.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},
{
  name: 'Tofu with Couscous and Zucchini',
  image: 'lunch44.png',
  ingredients: [
    { name: 'Tofu', amountInGrams: 250 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Zucchini', amountInGrams: 200 }
  ]
},
{
  name: 'Tilapia Fish with Couscous and Vegetables',
  image: 'lunch45.png',
  ingredients: [
    { name: 'Fish', unitName:'Tilapia', amountInGrams: 120 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Pasta', amountInGrams: 200 },
    { name: 'Cucumber', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Tomatoes', amountInGrams: 70, note: 'between 50 to 100 grams' },
    { name: 'Lettuce', amountInGrams: 70, note: 'between 50 to 100 grams' }
  ]
},

{
  name: 'Scrambled Eggs with Zucchini and Couscous',
  image: 'lunch46.png',
  ingredients: [
    { name: 'Eggs', unitsAmount: 6, unitName: 'eggs', note: 'only one yolk' },
    { name: 'Pasta', amountInGrams: 200 },
    { name: 'Couscous', amountInGrams: 100 }
  ]
},
{
  name: 'Chicken Breast with Pasta, Couscous and Salad',
  image: 'lunch47.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Zucchini', amountInGrams: 50 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 50 },
    { name: 'Tomatoes', amountInGrams: 50},
    { name: 'Lettuce', amountInGrams: 50 }
  ]
},
{
  name: 'Beef Steak with Couscous and Broccoli',
  image: 'lunch48.png',
  ingredients: [
    { name: 'Meat',unitName:'Beef Steak', amountInGrams: 100 },
    { name: 'Couscous', amountInGrams: 100 },
    { name: 'Broccoli', amountInGrams: 200 }
  ]
},

{
  name: 'Chicken Breast with Rice and Asparagus',
  image: 'lunch51.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Asparagus', amountInGrams: 200 }
  ]
},


{
  name: 'Chicken Breast with Pasta and Asparagus',
  image: 'lunch54.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Pasta', amountInGrams: 80 },
    { name: 'Asparagus', amountInGrams: 200 }
  ]
},
{
  name: 'Chicken Breast with Sweet Potato and Salad',
  image: 'lunch55.png',
  ingredients: [
    { name: 'Chicken Breast', amountInGrams: 100 },
    { name: 'Potatoes', amountInGrams: 100 },
    { name: 'Cucumber', amountInGrams: 70 },
    { name: 'Tomatoes', amountInGrams: 70 },
    { name: 'Lettuce', amountInGrams: 70 }
  ]
},

{
  
  name: 'Turkey Breast with Rice, Peas & Carrots',
  image: 'lunch56.png',
  ingredients: [
    { name: 'Turkey Breast', amountInGrams: 100 },
    { name: 'Rice', amountInGrams: 100 },
    { name: 'Peas', amountInGrams: 100, note: 'between 100 to 200 grams' },
    { name: 'Carrots', amountInGrams: 100, note: 'between 100 to 200 grams' }
  ]
},
{

  
  name: 'Turkey Breast with Rice, Broccoli & Asparagus',
    image: 'lunch57.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Rice', amountInGrams: 100 },
      { name: 'Broccoli', amountInGrams: 100, note: 'between 100 to 200 grams' },
      { name: 'Asparagus', amountInGrams: 100, note: 'between 100 to 200 grams' }
    ]
  },

  // Potatoes category
  {
    name: 'Turkey Breast with Roasted Baby Potatoes & Green Beans',
    image: 'lunch58.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Potatoes', amountInGrams: 100 },
      { name: 'Green Beans', amountInGrams: 200 }
    ]
  },
  {
    name: 'Turkey Breast with Roasted Baby Potatoes & Carrots',
    image: 'lunch59.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Potatoes', amountInGrams: 100 },
      { name: 'Carrots', amountInGrams: 200 }
    ]
  },

  // Couscous category
  {
    name: 'Turkey Breast with Couscous & Carrots',
    image: 'lunch60.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Couscous', amountInGrams: 100 },
      { name: 'Carrots', amountInGrams: 200 }
    ]
  },
  {
    name: 'Turkey Breast with Couscous & Spinach',
    image: 'lunch61.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Couscous', amountInGrams: 100 },
      { name: 'Spinach', amountInGrams: 200 }
    ]
  },

  // Quinoa category
  {
    name: 'Turkey Breast with Quinoa & Carrots',
    image: 'lunch62.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Quinoa', amountInGrams: 100 },
      { name: 'Carrots', amountInGrams: 200 }
    ]
  },
  {
    name: 'Turkey Breast with Quinoa, Zucchini & Bell Peppers',
    image: 'lunch63.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Quinoa', amountInGrams: 100 },
      { name: 'Zucchini', amountInGrams: 100,  note: 'between 100 to 200 grams'},
      { name: 'Bell Peppers', amountInGrams: 100,  note: 'between 100 to 200 grams'}
    ]
  },

  // Light bread category
  {
    name: 'Turkey Breast with Light Bread, Roasted Bell Peppers & Zucchini',
    image: 'lunch64.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Bread', unitsAmount: 3, unitName: 'slices' },
      { name: 'Bell Peppers', amountInGrams: 100, note: 'between 100 to 200 grams' },
      { name: 'Zucchini', amountInGrams: 100, note: 'between 100 to 200 grams' }
    ]
  },
  {
    name: 'Turkey Breast with Light Bread, Broccoli & Carrots',
    image: 'lunch65.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Bread', unitsAmount: 3, unitName: 'slices' },
      { name: 'Broccoli', amountInGrams: 100, note: 'between 100 to 200 grams' },
      { name: 'Carrots', amountInGrams: 100, note: 'between 100 to 200 grams' }
    ]
  },

  // Tortilla category
  {
    name: 'Turkey Breast with Tortilla, Cherry Tomatoes & Cucumber',
    image: 'lunch66.png',
    ingredients: [
      { name: 'Turkey Breast', amountInGrams: 100 },
      { name: 'Tortilla', unitsAmount: 1, unitName: 'piece' },
      { name: 'Tomatoes', amountInGrams: 100, note: 'between 100 to 200 grams' },
      { name: 'Cucumber', amountInGrams: 100, note: 'between 100 to 200 grams' }
    ]
  },
    {
    name: 'Shrimp with Rice and Broccoli',
    image: 'lunch68.png',
    ingredients: [
      { name: 'Shrimp',  amountInGrams: 120 },
      { name: 'Rice', amountInGrams: 100 },
      { name: 'Broccoli',         amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },
  {
    name: 'Shrimp with Rice, Carrots and Asparagus',
    image: 'lunch69.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Rice',             amountInGrams: 100 },
      { name: 'Carrots',          amountInGrams: 100,  note: 'between 100 to 200 grams' },
       { name: 'Asparagus', amountInGrams: 100, note: 'between 100 to 200 grams' }

    ]
  },

  // Shrimp + Couscous
  {
    name: 'Shrimp with Couscous and Broccoli',
    image: 'lunch70.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Couscous',         amountInGrams: 100 },
      { name: 'Broccoli',         amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },
  {
    name: 'Shrimp with Couscous and Bell Peppers',
    image: 'lunch71.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Couscous',         amountInGrams: 100 },
      { name: 'Bell Peppers',     amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },

  // Shrimp + Quinoa
  {
    name: 'Shrimp with Quinoa and Asparagus',
    image: 'lunch72.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Quinoa',           amountInGrams: 100 },
      { name: 'Asparagus',        amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },
  {
    name: 'Shrimp with Quinoa and Carrots',
    image: 'lunch73.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120,   },
      { name: 'Quinoa',           amountInGrams: 100,   },
      { name: 'Carrots',          amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },

  // Shrimp + Potatoes
  {
    name: 'Shrimp with Roasted Potatoes and Green Beans',
    image: 'lunch74.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Potatoes',         amountInGrams: 100 },
      { name: 'Green Beans',      amountInGrams: 100, note: 'between 100 to 200 grams'  }
    ]
  },
  {
    name: 'Shrimp with Roasted Potatoes and Carrots',
    image: 'lunch75.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Potatoes',         amountInGrams: 100 },
      { name: 'Carrots',          amountInGrams: 100, note: 'between 100 to 200 grams' }
    ]
  },

  // Shrimp + Light Bread
  {
    name: 'Shrimp with Light Bread and Asparagus',
    image: 'lunch76.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Bread',      unitsAmount: 3, unitName: 'pieces' },
      { name: 'Asparagus',        amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },
  {
    name: 'Shrimp with Light Bread and Carrots',
    image: 'lunch77.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Bread',      unitsAmount: 3, unitName: 'pieces' },
      { name: 'Carrots',          amountInGrams: 100,  note: 'between 100 to 200 grams' }
    ]
  },

  // Shrimp + Tortilla
  {
    name: 'Shrimp with Tortilla and Cucumber Salad',
    image: 'lunch78.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Tortilla',       amountInGrams: 50 , unitName: 'piece' },
      { name: 'Cucumber',         amountInGrams: 100,  note: 'between 50 to 100 grams' },
      { name: 'Cherry Tomatoes',  amountInGrams: 100, note: 'between 50 to 100 grams'   }
    ]
  },
  {
    name: 'Shrimp with Tortilla and Bell Peppers & Avocado',
    image: 'lunch79.png',
    ingredients: [
      { name: 'Shrimp',           amountInGrams: 120 },
      { name: 'Tortilla',        amountInGrams: 50, unitName: 'piece' },
      { name: 'Bell Peppers',     amountInGrams: 100,  note: 'between 50 to 100 grams'  },
      { name: 'Avocado',          amountInGrams: 100,  note: 'between 50 to 100 grams'  }
    ]
  },

  // Greek Yogurt + Fruit
  {
    name: 'Greek Yogurt with Strawberries & Blueberries',
    image: 'lunch80.png',
    ingredients: [
      { name: 'Yogurt',            amountInGrams: 220 },
      { name: 'Fruit',     amountInGrams: 300, unitName:'Strawberries' },
      { name: 'Fruit',      amountInGrams: 100, unitName:'Bluberries' }
    ]
  },
  {
    name: 'Greek Yogurt with Banana, Kiwi, Mango & Pomegranate',
    image: 'lunch81.png',
    ingredients: [
      { name: 'Yogurt',           amountInGrams: 220 },
      { name: 'Fruit',           unitsAmount: 1, unitName: 'Banana' },
      { name: 'Fruit',             unitsAmount: 1, unitName: 'Kiwi' },
      { name: 'Fruit',            amountInGrams: 80, unitName:'Mango' },
      { name: 'Pomegranate Seeds',amountInGrams: 50 }
    ]
  },

  // Greek Yogurt + Light Bread
  {
    name: 'Greek Yogurt with Light Bread & Asparagus',
    image: 'lunch82.png',
    ingredients: [
      { name: 'Yogurt',           amountInGrams: 220 },
      { name: 'Bread',      unitsAmount: 3, unitName: 'pieces' },

    ]
  },
  {
    name: 'Greek Yogurt with Light Bread & Carrots',
    image: 'lunch83.png',
    ingredients: [
      { name: 'Yogurt',         amountInGrams: 220 },

      { name: 'Fruit',      unitsAmount: 40, unitName: 'Grapes' },

    ]
  },

  // Greek Yogurt + Grapes
  {
    name: 'Greek Yogurt with Grapes',
    image: 'lunch84.png',
    ingredients: [
      { name: 'Yogurt',         amountInGrams: 220 },
      { name: 'Tortilla',           amountInGrams: 50 }
    ]
  },

  // Greek Yogurt + Tortilla


  // Greek Yogurt + Apple
  {
    name: 'Greek Yogurt with Apple Slices',
    image: 'lunch85.png',
    ingredients: [
      { name: 'Yogurt',          amountInGrams: 220 },
      { name: 'Fruit',            unitsAmount: 1, unitName: 'Apple' }
    ]
  }
]






  // Remaining 28 meals will be added in next batch


async function populateMeals() {
  const ingredients = await Ingredient.find({});
  let insertedCount = 0;

  for (const meal of rawMeals) {
const ingredientObjects = meal.ingredients
  .map(({ name, amountInGrams, unitsAmount, unitName, note }) => {
    const id = findIngredientId(ingredients, name);
    if (!id) return null;

    const ingredientObj = { ingredientId: id };

    // — grams —
    if (amountInGrams != null) {
      ingredientObj.amountInGrams = amountInGrams;
      // carry any unitName even if no unitsAmount
      if (unitName) {
        ingredientObj.unitName = unitName.trim();
      }
    }

    // — units —
    if (unitsAmount != null) {
      ingredientObj.unitsAmount = unitsAmount;
      // unitsAmount always comes with a unitName in your rawMeals
      if (unitName) {
        ingredientObj.unitName = unitName.trim();
      }
    }

    if (note != null) {
      ingredientObj.note = note;
    }

    return ingredientObj;
  })
  .filter(Boolean);


    if (ingredientObjects.length === 0) {
      console.warn(`Skipping meal "${meal.name}" due to missing ingredients`);
      continue;
    }

    const existingMeal = await Meal.findOne({ name: meal.name });
    if (existingMeal) {
      console.log(`Meal "${meal.name}" already exists. Skipping.`);
      continue;
    }

  const proteinTags = ingredientObjects.map(obj => {
  const ingredient = ingredients.find(i => i._id.equals(obj.ingredientId));
  return proteinSources.includes(ingredient?.name) ? ingredient.name : null;
}).filter(Boolean);

const carbTags = ingredientObjects.map(obj => {
  const ingredient = ingredients.find(i => i._id.equals(obj.ingredientId));
  return carbSources.includes(ingredient?.name) ? ingredient.name : null;
}).filter(Boolean);

    const newMeal = new Meal({
      name: meal.name,
      ingredients: ingredientObjects,
      proteinTags,
      carbTags,
      image: meal.image || ''
    });

    await newMeal.save();
    console.log(`Inserted meal: ${meal.name}`);
    insertedCount++;
  }

  console.log(`✅ Inserted ${insertedCount} meals`);
  mongoose.connection.close();
}

populateMeals();