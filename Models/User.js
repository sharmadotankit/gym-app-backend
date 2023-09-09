const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
    },
    height:{
        type:Number
    },
    weight:{
        type:Number
    },
    isPremium:{
        type:Boolean,
        default:false,
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;