const mongoose = require('mongoose');
const Ingredient = require('./ingredients');  // ✅ Make sure the path to your Ingredient model is correct

mongoose.connect('mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // ✅ Delete all ingredients (full refresh)
  await Ingredient.deleteMany({});
  console.log('✅ All existing ingredients have been deleted.');

  mongoose.connection.close();
})
.catch(err => console.error('❌ Database connection error:', err));
