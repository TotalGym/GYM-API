const Store = require('../models/store.model.js');

// Create Product
const addProduct = async (req, res) => {
    const { productName, image, inventoryCount } = req.body;
    const product = new Store({ productName, image, inventoryCount });
    try{
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Products
const getProducts = async (req, res) => {
    try{
        const products = await Store.find();
        res.status(200).json(products);
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
};

//Get One Product
const getProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Store.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Update Product
const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedProduct = await Store.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Store.findByIdAndDelete(id);
        if(!product) return res.status(404).json({message: 'Product not found'});
        const { productName } = product;
        res.status(200).json({ message: `Product ${productName} has been deleted` });
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct };
