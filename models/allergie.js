const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const allergySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Preference',
    required: true
  },
  allergy: {
    type: String,
    enum: ['gluten','lactose','none'],
    required: true
  }
}, { timestamps: true });


const Allergy = mongoose.model('Allergy', allergySchema);
module.exports = Allergy;
