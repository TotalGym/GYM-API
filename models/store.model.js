const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    productName: { type: String, required: [true, "Please add the product name"] },
    description: { type: String, required: true },
    image: { type: String, required: true },
    inventoryCount: { type: Number, required: [true, "Please add the number of the available products"] },
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;