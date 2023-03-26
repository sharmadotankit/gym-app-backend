const mongoose = require('mongoose');
const { Schema } = mongoose;

const SavedExerciseSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bodyPart: {
        type: String,
        default:""
    },
    equipment: {
        type: String,
        default:""
    },
    gifUrl: {
        type: String,
        default:""
    },
    exerciseid: {
        type: String,
        default:""
    },
    name: {
        type: String,
        default:"",
        required:true,
    },
    target:{
        type: String,
        default:""
    },
});


const SavedExercise = mongoose.model('savedExercise', SavedExerciseSchema);
module.exports = SavedExercise;