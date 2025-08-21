const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const Allergy = require('./models/allergie')
const Data = require('./models/data');
const Ingredient = require('./models/ingredients');
const Weight = require('./models/weight');  // assuming you already have your Weight model
const path = require('path');
const fs      = require('fs');
const Contact = require('./models/data2');

const DayPlan = require('./models/dayPlan');
const Meal = require('./models/meal');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Preference = require('./models/preference');
const app = express();
const dbUri = 'mongodb+srv://NewUser:Fitness22@cluster0.god6zpw.mongodb.net/';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3001, () => console.log('Server running on port 3001')))
  .catch((err) => console.log('Database connection error:', err));

app.use('/photos', express.static('views/photos'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, _res, next) => { 
  console.log(`${req.method} ${req.url}`); 
  next(); 
});
app.use(
  '/videos',
  (req, res, next) => {
    console.log('🔊 Video GET', req.path);
    next();
  },
  express.static(path.join(__dirname, 'assets/videos'))
);
app.use(express.static('views'));
app.set('view engine', 'ejs');

// Sessio// after you `npm install cors`

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
       maxAge: 60 * 60 * 1000
  }
}));
// Function to calculate user's daily nutritional needs
// simple pluralizer (for your unit names)
// sifunction pluralize(word, count) {
function pluralize(word, count) {
  if (count === 1) return word;
  const irregulars = {
    man: 'men',
    woman: 'women',
    child: 'children',
    person: 'people',
    mouse: 'mice',
    goose: 'geese',
    tooth: 'teeth',
    foot: 'feet',
  };
  const lw = word.toLowerCase();
  if (irregulars[lw]) {
    const p = irregulars[lw];
    return word[0] === word[0].toUpperCase()
      ? p[0].toUpperCase() + p.slice(1)
      : p;
  }
  if (/[b-df-hj-np-tv-z]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies';
  }
  if (/(s|x|z|ch|sh)$/i.test(word)) {
    return word + 'es';
  }
  if (word.endsWith('fe')) return word.slice(0, -2) + 'ves';
  if (word.endsWith('f')) return word.slice(0, -1) + 'ves';
  return word + 's';
}

const calculateIngredientQuantities = (meal, userWeight) => {
  const ingredientQuantities = [];
  if (!meal?.ingredients?.length) return { ingredientQuantities, totalWeight: 0 };

  const scaleFactor = userWeight / 75;

  // nearest 10, midpoint (lower+5) rounds down
  function smartRound(value) {
    const lower = Math.floor(value / 10) * 10;
    const midpoint = lower + 5;
    if (value <= midpoint) return lower;
    return lower + 10;
  }

  meal.ingredients.forEach(ing => {
    const baseName = (ing.ingredientId?.name || ing.name || '').trim();
    const lowerBaseName = baseName.toLowerCase();

    // — grams —
    if (ing.amountInGrams != null) {
      if (ing.amountInGrams === 200) {
        ingredientQuantities.push(`between 100 to 200 grams of ${baseName}`);
      } else {
        let raw = ing.amountInGrams * scaleFactor;
        let g = smartRound(raw);
        if (g < 10) g = 10; // enforce minimum 10g

        // If unitName exists, prefer that label instead of generic (especially for Fruit)
        let targetName = baseName;
        if (ing.unitName && typeof ing.unitName === 'string' && ing.unitName.trim() !== '') {
          targetName = ing.unitName.trim();
        }

        ingredientQuantities.push(`${g} grams of ${targetName}`);
      }
    }

    // — units (like apples, eggs, pieces of bread) —
    if (ing.unitsAmount != null && ing.unitName) {
      let units = Math.round(ing.unitsAmount * scaleFactor);
      if (units < 1) units = 1; // minimum 1 unit

      const rawUnitName = ing.unitName.trim(); // e.g., "apple", "pieces of bread"
      let entry = '';

      // Handle "pieces of X" explicitly to preserve "piece"/"pieces"
      const pieceMatch = rawUnitName.match(/^(pieces of|piece of)\s+(.+)$/i);
      if (pieceMatch) {
        const noun = pieceMatch[2];
        const label = units === 1 ? `piece of ${noun}` : `pieces of ${noun}`;
        entry = `${units} ${label}`;
      } else {
        // General singular/plural on unit name
        const cleaned = rawUnitName.replace(/s$/i, ''); // base singular guess
        const label = pluralize(cleaned, units);
        entry = `${units} ${label}`;
      }

      // Special fruit logic if ingredient name is 'Fruit' and unitName matches fruit types
      const cleanUnit = rawUnitName.toLowerCase().replace(/pieces of /i, '').trim();
      if (
        lowerBaseName === 'fruit' &&
        ['apple', 'banana', 'pear', 'peach', 'orange', 'kiwi', 'apricot', 'grape', 'grapes', 'strawberry', 'blueberry']
          .includes(cleanUnit)
      ) {
        // override to proper singular/plural of the fruit itself
        const fruitSingular = cleanUnit.replace(/s$/i, '');
        const fruitLabel = pluralize(fruitSingular, units);
        entry = `${units} ${fruitLabel}`;
      }

      if (ing.note) entry += ` (${ing.note})`;
      ingredientQuantities.push(entry);
    }
  });

  return { ingredientQuantities };
};


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


app.get('/home', (req, res) => res.render('home'));


// This replaces your old savePreferences:
app.post('/save-weight', async (req, res) => {
  try {
    const { weight } = req.body;  // receiving the selected weight

    if (!weight) {
      return res.status(400).send("No weight provided.");
    }

    const newWeight = new Weight({
      currentWeight: parseInt(weight)
    });

    await newWeight.save();

    console.log("Weight saved:", weight);
    res.redirect('/page21');  // after saving weight, go to preferences

  } catch (error) {
    console.error('Error saving weight:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submit-preferences', async (req, res) => {
  try {
    const { protein, carbo } = req.body;

    const newPref = new Preference({
      proteins: [protein],
      carbs: [carbo]
    });

    await newPref.save();
    console.log("Preferences saved:", newPref);
    res.redirect('/page22');  // or wherever you want after preferences
  } catch (err) {
    console.error('Error saving preferences:', err);
    res.status(500).send('Internal Server Error');
  }
});





app.post('/submit-allergies', async (req, res) => {
  try {
    const selectedAllergy = req.body.allergy;

    if (!selectedAllergy || selectedAllergy === 'None') {
      console.log('No allergy selected or user selected None');
      return res.redirect('/normal');
    }

    // Get most recent preference (simulate user for now)
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const userId = preferences?._id;

    if (!userId) {
      console.error('No userId found for allergy submission');
      return res.status(400).send('No userId found');
    }

    // Optional: prevent duplicate allergies for this user
    const exists = await Allergy.findOne({ userId, allergy: selectedAllergy.toLowerCase() });
    if (exists) {
      console.log("Allergy already exists for user:", selectedAllergy);
      return res.redirect('/page8');
    }

    const newAllergy = new Allergy({
      userId,
      allergy: selectedAllergy.toLowerCase()
    });

    await newAllergy.save();
    console.log("Allergy saved:", selectedAllergy);
    res.redirect('/page10');
  } catch (error) {
    console.error('Error saving allergy:', error);
    res.status(500).send('Error saving allergy');
  }
});



app.get('/results', (req, res) => {
  const weight = parseFloat(req.query.weight) || 0;
  res.render('results', { weight });
});
app.get('/day1normal/photo-page', (req, res) => {
  const firstPhoto = 'normal1.webp'; // Replace with the actual photo path
  res.render('firstPhoto', { photoPath: firstPhoto });
});
app.get('/twentyetfhpage', (req, res) => res.render('twentyetfhpage'));
app.get('/twentyonepage', (req, res) => res.render('twentyonepage'));
app.get('/eighteenthpage', (req, res) => res.render('eighteenthpage'));
app.get('/seventeenthpage', (req, res) => res.render('seventeenthpage'));
app.get('/fifteenthpage', (req, res) => res.render('fifteenthpage'));
app.get('/MorningRun', (req, res) => res.render('MorningRun'));
app.get('/sixthpage', (req, res) => res.render('sixthpage'));
app.get('/Meditation', (req, res) => res.render('Meditation'));
app.get('/eightpage', (req, res) => res.render('eightpage'));
app.get('/SmoothieBowls', (req, res) => res.render('SmoothieBowls'));
app.get('/seventhpage', (req, res) => res.render('seventhpage'));
app.get('/ThreeHours', (req, res) => res.render('ThreeHours'));
app.get('/MealPrep', (req, res) => res.render('MealPrep'));
app.get('/Workout', (req, res) => res.render('Workout'));
app.get('/sixteenthpage', (req, res) => res.render('sixteenthpage'));
app.get('/about', (req, res) => res.render('about'));
app.get('/eleventhpage', (req, res) => res.render('eleventhpage'));
app.get('/fifthpage', (req, res) => res.render('fifthpage'));
app.get('/terms', (req, res) => res.render('terms'));
app.get('/tenthpage', (req, res) => res.render('tenthpage'));
app.get('/blog', (req, res) => res.render('blog'));
app.get('/ninthpage', (req, res) => res.render('ninthpage'));
app.get('/privacy', (req, res) => res.render('privacy'));
app.get('/thirteenthpage', (req, res) => res.render('thirteenthpage'))
app.get('/fourteenthpage', (req, res) => res.render('fourteenthpage'))
app.get('/fourthpage', (req, res) => res.render('fourthpage'));
app.get('/preferences', (req, res) => res.render('preferences'));
app.get('/alergies', (req, res) => res.render('alergies'));
app.get('/payment', (req, res) => res.render('payment'));
app.get('/nineteenthpage', (req, res) => res.render('nineteenthpage'));
app.get('/information2', (req, res) => {
  console.log('Session data at /information2:', req.session);
  res.render('information2');
});

app.get('/information', (req, res) => {
  console.log('Session data at /information2:', req.session);
  res.render('information');
});

app.get('/secondpage', (req, res) => res.render('secondpage'));
app.get('/sales', (req, res) => res.render('sales'));

app.get('/option', (req, res) => res.render('option'));

app.get('/new', (req, res) => res.render('new'));

app.get('/firstpage', (req, res) => res.render('firstpage'));

app.get('/contact', (req, res) => res.render('contact'));
app.get('/thirdpage', (req, res) => res.render('thirdpage'));

app.get('/page1', (req, res) => res.render('page1'));
app.get('/page2', (req, res) => res.render('page2'));
app.get('/page3', (req, res) => res.render('page3'));
app.get('/page4', (req, res) => res.render('page4'));
app.get('/page5', (req, res) => res.render('page5'));
app.get('/page6', (req, res) => res.render('page6'));
app.get('/page7', (req, res) => res.render('page7'));
app.get('/page1', (req, res) => res.render('page1'));
app.get('/page2', (req, res) => res.render('page2'));
app.get('/page3', (req, res) => res.render('page3'));
app.get('/page4', (req, res) => res.render('page4'));
app.get('/page5', (req, res) => res.render('page5'));
app.get('/page6', (req, res) => res.render('page6'));
app.get('/page7', (req, res) => res.render('page7'));
app.get('/page8', (req, res) => res.render('page8'));
app.get('/page9', (req, res) => res.render('page9'));
app.get('/page10', (req, res) => res.render('page10'));
app.get('/page11', (req, res) => res.render('page11'));
app.get('/page12', (req, res) => res.render('page12'));
app.get('/page13', (req, res) => res.render('page13'));
app.get('/page14', (req, res) => res.render('page14'));
app.get('/page15', (req, res) => res.render('page15'));
app.get('/page16', (req, res) => res.render('page16'));
app.get('/page17', (req, res) => res.render('page17'));
app.get('/page18', (req, res) => res.render('page18'));
app.get('/page19', (req, res) => res.render('page19'));
app.get('/page20', (req, res) => res.render('page20'));
app.get('/page21', (req, res) => res.render('page21'));
app.get('/page22', (req, res) => res.render('page22'));

    // ✅ Save userId in session


app.post('/save-weight', async (req, res) => {
  try {
    const { currentWeight, targetWeight } = req.body;
    if (currentWeight == null) {
      return res.status(400).json({ error: "No weight provided" });
    }

    const newWeight = new Weight({
      currentWeight: parseInt(currentWeight, 10),
      // If you collect a targetWeight, add it to your schema first
      ...(targetWeight != null && { targetWeight: parseInt(targetWeight, 10) }),
    });

    await newWeight.save();
    console.log("Weight saved:", currentWeight);

    // If the request wants JSON, send JSON; otherwise fall back to redirect
    if (req.is('application/json') || req.accepts('json')) {
      return res.json({ success: true, currentWeight: newWeight.currentWeight });
    } else {
      return res.redirect('/page7');
    }

  } catch (error) {
    console.error('Error saving weight:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for normal meals
app.get('/normal', (req, res) => {
  res.render('normal', { userName: req.session.userName || 'Guest' });
});


// Route for vegetarian meals

app.get('/vegetarian', (req, res) => {
 
  res.render('vegetarian', { userName: req.session.userName || 'Guest' });
});






 // Make sure to create and import the new DayPlan model


// at the top of your file, make sure you have:
// const cors = require('cors');
// app.use(cors());

// at top of ap
// … your other requires …
app.use('/photos', express.static(path.join(__dirname, 'views/photos')));
// Serve anything in assets/videos at http://<your-host>/videos/...

// new JSON API for day plans
app.get('/api/day/:dayNumber', async (req, res) => {
  try {
    const dayNumber = parseInt(req.params.dayNumber, 10);
    if (isNaN(dayNumber) || dayNumber < 1) {
      return res.status(400).json({ error: 'Invalid day number' });
    }

    // 1) load latest weight
    const weightDoc = await Weight.findOne().sort({ _id: -1 });
    if (!weightDoc) return res.status(400).json({ error: 'No weight found' });
    const weight = weightDoc.currentWeight;

    // 2) load prefs & allergies
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const userId = preferences?._id;
    const allergies = await Allergy.find({ userId }).sort({ _id: -1 });
    const latestAllergy = allergies.length
      ? allergies[0].allergy.toLowerCase()
      : 'none';

    const preferredProteins = new Set(
      (preferences?.proteins || []).map(p => p.toLowerCase())
    );
    const preferredCarbs = new Set(
      (preferences?.carbs || []).map(c => c.toLowerCase())
    );

    // 3) fetch & filter meals
    const allMeals = await Meal.find().populate('ingredients.ingredientId');
    let safeMeals;
    if (latestAllergy === 'gluten') {
      const banned = ['bread', 'tortilla'];
      safeMeals = allMeals.filter(m =>
        m.ingredients.every(i =>
          !banned.includes(i.ingredientId.name.toLowerCase())
        )
      );
    } else if (latestAllergy === 'lactose') {
      const banned = ['cheese', 'yogurt'];
      safeMeals = allMeals.filter(m =>
        m.ingredients.every(i =>
          !banned.includes(i.ingredientId.name.toLowerCase())
        )
      );
    } else {
      safeMeals = allMeals;
    }

    // 4–5) pick or load DayPlan
    let dayPlan = await DayPlan.findOne({ userId, dayNumber });
    let selectedMeals;
    if (!dayPlan) {
      shuffleArray(safeMeals);
      const firstTwo = safeMeals
        .filter(meal => {
          const p = meal.proteinTags.map(t => t.toLowerCase());
          const c = meal.carbTags.map(t => t.toLowerCase());
          return (
            p.some(x => ['eggs','fish','tofu'].includes(x)) &&
            c.some(x => ['bread','quinoa','fruit','tortilla'].includes(x))
          );
        })
        .slice(0,2);

      const lastThree = safeMeals
        .filter(meal => {
          const p = meal.proteinTags.map(t => t.toLowerCase());
          const c = meal.carbTags.map(t => t.toLowerCase());
          return (
            p.some(x => preferredProteins.has(x)) ||
            c.some(x => preferredCarbs.has(x))
          );
        })
        .filter(m => !firstTwo.includes(m))
        .slice(0,3);

      selectedMeals = [...firstTwo, ...lastThree];
      if (selectedMeals.length < 5) {
        return res.status(404).json({ error: `Not enough meals for Day ${dayNumber}.` });
      }
      dayPlan = await DayPlan.create({
        userId,
        dayNumber,
        mealIds: selectedMeals.map(m => m._id)
      });
    } else {
      selectedMeals = await Meal.find({
        _id: { $in: dayPlan.mealIds }
      }).populate('ingredients.ingredientId');
    }

    // 6) build meal payload
    const host = `${req.protocol}://${req.get('host')}`;
    const mealsWithQuantities = selectedMeals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(meal, weight);
      return {
        mealName:           meal.name,
        ingredientQuantities,
        imageUrl: meal.image
          ? `${host}/photos/${meal.image}`
          : null
      };
    });

    // 7) select video only for days 1–10
    const allVideos = fs
      .readdirSync(path.join(__dirname, 'assets/videos'))
      .filter(f => f.toLowerCase().endsWith('.mp4'));

    let videoUrl = null;
    if (dayNumber >= 1 && dayNumber <= allVideos.length) {
      const vidIndex = dayNumber - 1;
      videoUrl = `${host}/videos/${allVideos[vidIndex]}`;
    }

    // 8) send JSON payload
    res.json({
      dayNumber,
      userName: req.session.userName || 'Guest',
      videoUrl,
      meals: mealsWithQuantities
    });
  } catch (err) {
    console.error('Error in /api/day/:dayNumber:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Route for Day 1 meals
console.log("Sending response to client");


// Route for Day 1 meals
console.log("Sending response to client");




app.get('/day2normal', async (req, res) => {
  try {
    const weightDoc = await Weight.findOne().sort({ _id: -1 }); 
    if (!weightDoc) return res.status(400).send("No weight found.");
    const weight = weightDoc.currentWeight;

    // Get most recent preferences and allergies
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const allergiesDocs = await Allergy.find().sort({ _id: -1 });

    const allergyList = allergiesDocs.map(a => a.allergy.toLowerCase());
    const preferredProteins = preferences?.proteins.map(p => p.toLowerCase()) || [];
    const preferredCarbs = preferences?.carbs.map(c => c.toLowerCase()) || [];

    const allMeals = await Meal.find().populate('ingredients.ingredientId');

    const safeMeals = allMeals.filter(meal =>
      !meal.ingredients.some(ing => allergyList.includes(ing.ingredientId.name.toLowerCase()))
    );

    shuffleArray(safeMeals);

    const firstTwo = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => ['eggs','fish'].includes(p)) &&
        carbTagsLower.some(c => ['apple', 'bread', 'quinoa', 'strawberries', 'pineapple', 'banana', 'peach'].includes(c))
      );
    }).slice(0, 2);

    const lastThree = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => preferredProteins.includes(p)) ||
        carbTagsLower.some(c => preferredCarbs.includes(c))
      );
    }).filter(meal => !firstTwo.includes(meal)).slice(0, 3);

    const selectedMeals = [...firstTwo, ...lastThree];
    console.log("FirstTwo:", firstTwo.length, "LastThree:", lastThree.length, "Total:", selectedMeals.length);

    if (selectedMeals.length < 5) {
      return res.status(404).send('Not enough meals for Day 1.');
    }

    const mealsWithQuantities = selectedMeals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(meal, weight);
      return { mealName: meal.name, image: meal.image, ingredientQuantities };
    });

    res.render('day2normal', { userName: 'Guest', mealsWithQuantities });

  } catch (err) {
    console.error('Error in /day2normal:', err);
    res.status(500).send('Server error');
  }
});



app.get('/day3normal', async (req, res) => {
  try {
    const weightDoc = await Weight.findOne().sort({ _id: -1 }); 
    if (!weightDoc) return res.status(400).send("No weight found.");
    const weight = weightDoc.currentWeight;

    // Get most recent preferences and allergies
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const allergiesDocs = await Allergy.find().sort({ _id: -1 });

    const allergyList = allergiesDocs.map(a => a.allergy.toLowerCase());
    const preferredProteins = preferences?.proteins.map(p => p.toLowerCase()) || [];
    const preferredCarbs = preferences?.carbs.map(c => c.toLowerCase()) || [];

    const allMeals = await Meal.find().populate('ingredients.ingredientId');

    const safeMeals = allMeals.filter(meal =>
      !meal.ingredients.some(ing => allergyList.includes(ing.ingredientId.name.toLowerCase()))
    );

    shuffleArray(safeMeals);

    const firstTwo = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => ['eggs','fish'].includes(p)) &&
        carbTagsLower.some(c => ['apple', 'bread', 'quinoa', 'strawberries', 'pineapple', 'banana', 'peach'].includes(c))
      );
    }).slice(0, 2);

    const lastThree = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => preferredProteins.includes(p)) ||
        carbTagsLower.some(c => preferredCarbs.includes(c))
      );
    }).filter(meal => !firstTwo.includes(meal)).slice(0, 3);

    const selectedMeals = [...firstTwo, ...lastThree];
    console.log("FirstTwo:", firstTwo.length, "LastThree:", lastThree.length, "Total:", selectedMeals.length);

    if (selectedMeals.length < 5) {
      return res.status(404).send('Not enough meals for Day 1.');
    }

    const mealsWithQuantities = selectedMeals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(meal, weight);
      return { mealName: meal.name, image: meal.image, ingredientQuantities };
    });

    res.render('day3normal', { userName: 'Guest', mealsWithQuantities });

  } catch (err) {
    console.error('Error in /day3normal:', err);
    res.status(500).send('Server error');
  }
});


app.get('/day4normal', async (req, res) => {
  try {
    const weightDoc = await Weight.findOne().sort({ _id: -1 }); 
    if (!weightDoc) return res.status(400).send("No weight found.");
    const weight = weightDoc.currentWeight;

    // Get most recent preferences and allergies
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const allergiesDocs = await Allergy.find().sort({ _id: -1 });

    const allergyList = allergiesDocs.map(a => a.allergy.toLowerCase());
    const preferredProteins = preferences?.proteins.map(p => p.toLowerCase()) || [];
    const preferredCarbs = preferences?.carbs.map(c => c.toLowerCase()) || [];

    const allMeals = await Meal.find().populate('ingredients.ingredientId');

    const safeMeals = allMeals.filter(meal =>
      !meal.ingredients.some(ing => allergyList.includes(ing.ingredientId.name.toLowerCase()))
    );

    shuffleArray(safeMeals);

    const firstTwo = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => ['eggs','fish'].includes(p)) &&
        carbTagsLower.some(c => ['apple', 'bread', 'quinoa', 'strawberries', 'pineapple', 'banana', 'peach'].includes(c))
      );
    }).slice(0, 2);

    const lastThree = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => preferredProteins.includes(p)) ||
        carbTagsLower.some(c => preferredCarbs.includes(c))
      );
    }).filter(meal => !firstTwo.includes(meal)).slice(0, 3);

    const selectedMeals = [...firstTwo, ...lastThree];
    console.log("FirstTwo:", firstTwo.length, "LastThree:", lastThree.length, "Total:", selectedMeals.length);

    if (selectedMeals.length < 3) {
      return res.status(404).send('Not enough meals for Day 1.');
    }

    const mealsWithQuantities = selectedMeals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(meal, weight);
      return { mealName: meal.name, image: meal.image, ingredientQuantities };
    });

    res.render('day4normal', { userName: 'Guest', mealsWithQuantities });

  } catch (err) {
    console.error('Error in /day4normal:', err);
    res.status(500).send('Server error');
  }
});


app.get('/test-image', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/photos/DALL·E_2024-11-01_02-46-24_normal6.webp'));
});


app.get('/day5normal', async (req, res) => {
  try {
    const weightDoc = await Weight.findOne().sort({ _id: -1 }); 
    if (!weightDoc) return res.status(400).send("No weight found.");
    const weight = weightDoc.currentWeight;

    // Get most recent preferences and allergies
    const preferences = await Preference.findOne().sort({ _id: -1 });
    const allergiesDocs = await Allergy.find().sort({ _id: -1 });

    const allergyList = allergiesDocs.map(a => a.allergy.toLowerCase());
    const preferredProteins = preferences?.proteins.map(p => p.toLowerCase()) || [];
    const preferredCarbs = preferences?.carbs.map(c => c.toLowerCase()) || [];

    const allMeals = await Meal.find().populate('ingredients.ingredientId');

    const safeMeals = allMeals.filter(meal =>
      !meal.ingredients.some(ing => allergyList.includes(ing.ingredientId.name.toLowerCase()))
    );

    shuffleArray(safeMeals);

    const firstTwo = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => ['eggs','fish'].includes(p)) &&
        carbTagsLower.some(c => ['apple', 'bread', 'quinoa', 'strawberries', 'pineapple', 'banana', 'peach'].includes(c))
      );
    }).slice(0, 2);

    const lastThree = safeMeals.filter(meal => {
      const proteinTagsLower = meal.proteinTags.map(p => p.toLowerCase());
      const carbTagsLower = meal.carbTags.map(c => c.toLowerCase());
      return (
        proteinTagsLower.some(p => preferredProteins.includes(p)) ||
        carbTagsLower.some(c => preferredCarbs.includes(c))
      );
    }).filter(meal => !firstTwo.includes(meal)).slice(0, 3);

    const selectedMeals = [...firstTwo, ...lastThree];
    console.log("FirstTwo:", firstTwo.length, "LastThree:", lastThree.length, "Total:", selectedMeals.length);

    if (selectedMeals.length < 5) {
      return res.status(404).send('Not enough meals for Day 5.');
    }

    const mealsWithQuantities = selectedMeals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(meal, weight);
      return { mealName: meal.name, image: meal.image, ingredientQuantities };
    });

    res.render('day5normal', { userName: 'Guest', mealsWithQuantities });

  } catch (err) {
    console.error('Error in /day5normal:', err);
    res.status(500).send('Server error');
  }
});


app.get('/dayvegetarian1', async (req, res) => {
  const weight = req.session.weight || 70;
  const foodtype = req.session.foodtype || 'normal';  // Default to 'normal' if not set

  const nutritionalNeeds = calculateNutritionalNeeds(weight);
  const { totalCarbs, totalProtein } = nutritionalNeeds;

  try {
    const meals = await Meal.find({ type: foodtype, day: 1 }).populate('ingredients.ingredientId');

    if (!meals || meals.length === 0) {
      return res.status(404).send('No meals found for day 1. Please check back later or try again.');
    }

    // Scale meals according to the number of meals in the day
    const totalMeals = meals.length;

    const mealsWithQuantities = meals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(totalCarbs, totalProtein, meal, totalMeals);
      return { mealName: meal.name, ingredientQuantities };
    });

    const mealsWithImages = [
    'DALL·E 2024-11-01 13.32.38 - vegeterian1.webp',
    'DALL·E 2024-11-01 13.32.45 - vegetarian2.webp',
    'DALL·E 2024-11-01 13.32.52 - vegetarian3 .webp',
'DALL·E 2024-11-01 13.32.55 - vegetarian4.webp',
'DALL·E 2024-11-01 13.32.57 - vegetarian5 .webp',



    ];

    res.render('dayvegetarian1', {
      userName: req.session.userName || 'Guest',
      mealsWithQuantities,
      mealsWithImages
    });

  } catch (error) {
    console.error('Error fetching meals for day 2:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/dayvegetarian2', async (req, res) => {
  const weight = req.session.weight || 70;
  const foodtype = req.session.foodtype || 'normal';  // Default to 'normal' if not set

  const nutritionalNeeds = calculateNutritionalNeeds(weight);
  const { totalCarbs, totalProtein } = nutritionalNeeds;

  try {
    const meals = await Meal.find({ type: foodtype, day: 2 }).populate('ingredients.ingredientId');

    if (!meals || meals.length === 0) {
      return res.status(404).send('No meals found for day 2. Please check back later or try again.');
    }

    // Scale meals according to the number of meals in the day
    const totalMeals = meals.length;

    const mealsWithQuantities = meals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(totalCarbs, totalProtein, meal, totalMeals);
      return { mealName: meal.name, ingredientQuantities };
    });

    const mealsWithImages = [
 'DALL·E 2024-11-01 13.33.05 - vegetarian6.webp',
 'DALL·E 2024-11-01 13.33.07 - vegtarian7.webp',
'DALL·E 2024-11-01 13.33.09 - vegetarian8 .webp',
'DALL·E 2024-11-01 13.33.11 - vegetarian9.webp',
'DALL·E 2024-11-01 13.33.14 - vegetarian10.webp',



    ];

    res.render('dayvegetarian2', {
      userName: req.session.userName || 'Guest',
      mealsWithQuantities,
      mealsWithImages
    });

  } catch (error) {
    console.error('Error fetching meals for day 2:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/dayvegetarian3', async (req, res) => {
  const weight = req.session.weight || 70;
  const foodtype = req.session.foodtype || 'normal';  // Default to 'normal' if not set

  const nutritionalNeeds = calculateNutritionalNeeds(weight);
  const { totalCarbs, totalProtein } = nutritionalNeeds;

  try {
    const meals = await Meal.find({ type: foodtype, day: 3 }).populate('ingredients.ingredientId');

    if (!meals || meals.length === 0) {
      return res.status(404).send('No meals found for day 3. Please check back later or try again.');
    }

    // Scale meals according to the number of meals in the day
    const totalMeals = meals.length;

    const mealsWithQuantities = meals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(totalCarbs, totalProtein, meal, totalMeals);
      return { mealName: meal.name, ingredientQuantities };
    });

    const mealsWithImages = [
'DALL·E 2024-11-01 13.33.24 - vegetarian11.webp',
'DALL·E 2024-11-01 13.33.32 - vegetarian12.webp',
'DALL·E 2024-11-01 13.33.34 - vegetarian13.webp',
'DALL·E 2024-11-01 13.33.43 - vegetarian14.webp',
'DALL·E 2024-11-01 13.33.45 -vegetarian15.webp'



    ];

    res.render('dayvegetarian3', {
      userName: req.session.userName || 'Guest',
      mealsWithQuantities,
      mealsWithImages
    });

  } catch (error) {
    console.error('Error fetching meals for day 3:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/dayvegetarian4', async (req, res) => {
  const weight = req.session.weight || 70;
  const foodtype = req.session.foodtype || 'normal';  // Default to 'normal' if not set

  const nutritionalNeeds = calculateNutritionalNeeds(weight);
  const { totalCarbs, totalProtein } = nutritionalNeeds;

  try {
    const meals = await Meal.find({ type: foodtype, day: 4 }).populate('ingredients.ingredientId');

    if (!meals || meals.length === 0) {
      return res.status(404).send('No meals found for day 4. Please check back later or try again.');
    }

    // Scale meals according to the number of meals in the day
    const totalMeals = meals.length;

    const mealsWithQuantities = meals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(totalCarbs, totalProtein, meal, totalMeals);
      return { mealName: meal.name, ingredientQuantities };
    });

    const mealsWithImages = [
'DALL·E 2024-11-01 13.33.46 - vegetarian16 .webp',
'DALL·E 2024-11-01 13.33.52 - vegetarian17.webp',
'DALL·E 2024-11-01 13.33.55 - vegetarian18.webp',
'DALL·E 2024-11-01 13.33.57 - vegetarian19.webp',
'DALL·E 2024-11-01 13.34.02 - vegetarian20.webp'





    ];

    res.render('dayvegetarian4', {
      userName: req.session.userName || 'Guest',
      mealsWithQuantities,
      mealsWithImages
    });

  } catch (error) {
    console.error('Error fetching meals for day 2:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/dayvegetarian5', async (req, res) => {
  const weight = req.session.weight || 70;
  const foodtype = req.session.foodtype || 'normal';  // Default to 'normal' if not set

  const nutritionalNeeds = calculateNutritionalNeeds(weight);
  const { totalCarbs, totalProtein } = nutritionalNeeds;

  try {
    const meals = await Meal.find({ type: foodtype, day: 5 }).populate('ingredients.ingredientId');

    if (!meals || meals.length === 0) {
      return res.status(404).send('No meals found for day 5. Please check back later or try again.');
    }

    // Scale meals according to the number of meals in the day
    const totalMeals = meals.length;

    const mealsWithQuantities = meals.map(meal => {
      const { ingredientQuantities } = calculateIngredientQuantities(totalCarbs, totalProtein, meal, totalMeals);
      return { mealName: meal.name, ingredientQuantities };
    });

    const mealsWithImages = [

'DALL·E 2024-11-01 13.34.04 - vegetarian21.webp',
'DALL·E 2024-11-01 13.34.05 - vegetarian22 .webp',
'DALL·E 2024-11-01 13.34.07 - vegetarian23.webp',
'DALL·E 2024-11-01 13.34.09 - vegetarian24 .webp',
'DALL·E 2025-01-19 19.57.48 - vegetarian25.webp',
    ];

    res.render('dayvegetarian5', {
      userName: req.session.userName || 'Guest',
      mealsWithQuantities,
      mealsWithImages
    });

  } catch (error) {
    console.error('Error fetching meals for day 5:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Post route for saving user information and starting checkout
app.post('/saveInformation', async (req, res) => {
  try {
    const { name, weight, age, gender, foodtype } = req.body;

    req.session.userName = name;
    req.session.weight = weight;
    req.session.foodtype = foodtype;

    const nutritionalNeeds = calculateNutritionalNeeds(parseFloat(weight));
    const { totalCarbs, totalProtein } = nutritionalNeeds;

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Buy the daily menu' },
            unit_amount: 600,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });

    return res.redirect(stripeSession.url);

  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/saveInformation1', async (req, res) => {
  const { name, weight, age, gender, foodtype, body } = req.body;

  // Save user data (assuming you have a User model)
  const user = new Data({
    name,
    weight,
    age,
    gender,
    foodtype,
    body
  });
  await user.save();

  // Store session data for later use:
  req.session.userId = user._id;
  req.session.userName = name;
  req.session.weight = weight;
  req.session.foodtype = foodtype;

  // ✅ After saving, redirect directly to preferences page
  res.redirect('/preferences');
});
app.post('/submit-allergies', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('User not logged in.');
    }

    const selectedAllergy = req.body.allergy;

    // Save the allergy to the database
    const newAllergy = new Allergy({
      userId: userId,
      allergy: selectedAllergy
    });

    await newAllergy.save();

    console.log('Allergy saved:', selectedAllergy);

    // Redirect to normal page (or whatever page you want after allergy step)
    res.redirect('/normal');

  } catch (error) {
    console.error('Error saving allergy:', error);
    res.status(500).send('Error saving allergy');
  }
});
// Route for handling Stripe success after payment
app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(500).send('Internal Server Error: No session ID.');
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status === 'paid') {
      const foodtype = req.session.foodtype;

      if (!foodtype) {
        return res.status(500).send('Internal Server Error: Food type not found.');
      }

      switch (foodtype.trim().toLowerCase()) {
        case 'normal':
          res.redirect('/normal');
          break;
        case 'vegetarian':
          res.redirect('/vegetarian');
          break;
        case 'vegan':
          res.redirect('/vegan');
          break;
        default:
          res.status(500).send('Internal Server Error: Invalid food type.');
      }
    } else {
      res.status(500).send('Payment not completed.');
    }
  } catch (error) {
    console.error('Error retrieving Stripe session:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/send-contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('send-contact error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
});
