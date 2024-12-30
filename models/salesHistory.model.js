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
    required: true, 
  },

  SaleDate: {
    type: Date,
    default: Date.now,
    required: true,
  },

  QuantitySold: {
    type: Number,
    required: true,
    min: 1,
  },

  Price: {
    type: Number,
    required: [true, "You must provide a price"],
    min: 0,
  },

  TotalSaleValue: {
    type: Number,
    required: true,
  },
},
{
  timestamps: true,
}
);

//Calculate TotalSaleValue            // do this in forntEnd instade of backend ? duplication ?
salesHistorySchema.pre('save', function (next) {
  this.TotalSaleValue = this.QuantitySold * this.Price;
  next();
});

const SalesHistory = mongoose.model('SalesHistory', salesHistorySchema);

module.exports = SalesHistory;
