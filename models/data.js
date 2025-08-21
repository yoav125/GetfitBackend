const mongoose=require('mongoose');
const Schema= mongoose.Schema;
const dataSchema=new Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    foodtype: {
        type: String,
        required: true
    },

}, {timestamps: true});
const Data= mongoose.model('Data',dataSchema);
module.exports=Data; 


