const mongoose = require('mongoose');

const programSchema = mongoose.Schema({
    programName: {type: String, required: [true, "Please Enter the program name"]},
    exercises: [
        {
            name: { type: String, required: [true, "Please add Exercise name"] },
            sets: { type: Number, required: [true, "Please add the number of sets"] },
            repetitions: { type: Number, required: [true, "Please add the number of repetitions"] },
        },
    ],
    description: { type: String, required: true},
    monthlyPrice: { type: Number, required: true },
    annuallyPrice: { type: Number, required: true  },
    image: { type: String, required: true},
    schedule: [
        {
            day: { type: String, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
        },
    ],
    registeredTrainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainee' }],
}, { timestamps: true });

const Program = mongoose.model('Program', programSchema);
module.exports = Program;