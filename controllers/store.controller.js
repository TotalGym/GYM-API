const Store = require('../models/store.model.js');
const { paginatedResults } = require('../utils/pagination.js');
const { search } = require('../utils/search.js');

const addProduct = async (req, res) => {
    const { productName, image, inventoryCount } = req.body;
    const product = new Store({ productName, image, inventoryCount });
    try{
        const savedProduct = await product.save();

        delete savedProduct.__v;
        delete savedProduct.updatedAt;

        res.status(201).json(savedProduct);
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const query = search(Store, searchTerm);

        const options = {
            populateFields: [],
        };

        const paginatedResponse = await paginatedResults(Store, query, req, options);

        res.status(200).json(paginatedResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  
const getProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Store.findById(id).select("-__v -updatedAt");
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedProduct = await Store.findByIdAndUpdate(id, req.body, { new: true }).select("-__v -updatedAt");
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(updatedProduct);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

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
