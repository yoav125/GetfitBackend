
 const mongoose = require('mongoose');
const Meal = require('./meal');  // ✅ Make sure your correct path is here!

mongoose.connect('mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // ✅ New logic: delete ALL meals (full refresh)
  await Meal.deleteMany({});
  console.log('✅ All existing meals have been deleted.');

  mongoose.connection.close();
})
.catch(err => console.error('❌ Database connection error:', err));
