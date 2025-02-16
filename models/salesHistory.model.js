const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const salesHistorySchema = new mongoose.Schema({
  ProductID: {
    type: ObjectId,
    ref: 'Store',
    required: [true, "Product Id must be entered"],
  },

  TraineeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainee',
    required: false, 
  },

  SaleDate: {
    type: Date,
    default: Date.now,
    required: true,
  },

  quantitySold: {
    type: Number,
    required: true,
    min: 1,
  },

  price: {
    type: Number,
    min: 0,
  },

  totalSaleValue: {
    type: Number,
    required: true,
    min:0,
  },
},
{
  timestamps: true,
}
);

const SalesHistory = mongoose.model('SalesHistory', salesHistorySchema);

module.exports = SalesHistory;
