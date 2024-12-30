const SalesHistory = require('../models/salesHistory.model.js');
const Store = require('../models/store.model.js');

exports.addSale = async (req, res) => {
  const { ProductID, QuantitySold, Price } = req.body;

  try {
    const product = await Store.findById(ProductID);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.InventoryCount < QuantitySold) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }
    product.InventoryCount -= QuantitySold;
    await product.save();

    const sale = new SalesHistory({
      ProductID,
      QuantitySold,
      Price,
    });
    await sale.save();

    res.status(201).json({ sale, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await SalesHistory.find().populate('ProductID', 'ProductName');  //read more about populate
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales by product
exports.getSalesByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const sales = await SalesHistory.find({ ProductID: productId }).populate('ProductID', 'ProductName');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//maybe not needed ?
exports.deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await SalesHistory.findByIdAndDelete(id);
    if (!sale) {
      return res.status(404).json({ error: 'This Sale History not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFilteredSales = async (req, res) => {
    try {
      const sales = await SalesHistory.find()
        .populate({
          path: 'ProductID',
          select: 'ProductName',
        })
        .populate({
          path: 'TraineeID',
          select: 'Name Contact.Email',
        })
        ;
  
      const formattedSales = sales.map((sale) => ({
        id: sale._id,
        productName: sale.ProductID?.ProductName || null,
        traineeName: sale.TraineeID?.Name || null,
        traineeEmail: sale.TraineeID?.Contact?.Email || null,
        quantitySold: sale.QuantitySold,
        price: sale.Price,
        totalSaleValue: sale.TotalSaleValue,
        saleDate: sale.SaleDate,
      }));
  
      res.status(200).json(formattedSales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  