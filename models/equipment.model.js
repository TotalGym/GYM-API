const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please enter an equipment name"] },
  type: { type: String, required: [true , "Please add a type"] },
  quantity: { type: Number, required: [true, "Please add a quantity"] },
  image: { type: String, required: [true, "Please add an image"] },
  status: { 
    type: String, 
    enum: ['Available', 'In Use', 'Under Maintenance'], 
    required: [true, "Enter the status of the equipment"] 
  },  
},
{
    timestamps: true,
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
