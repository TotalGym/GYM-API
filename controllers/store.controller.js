const Store = require('../models/store.model.js');
const { paginatedResults } = require('../utils/pagination.js');
const { responseHandler } = require('../utils/responseHandler.js');
const { search } = require('../utils/search.js');

const addProduct = async (req, res) => {
    try{
        const { productName, image, inventoryCount, description } = req.body;

        if (!productName || inventoryCount == null) {
            return responseHandler(res, 400, false, "Product name and inventory count are required.");
        }

        const product = new Store({ productName, image, inventoryCount, description });
        const savedProduct = await product.save();
        const productData = savedProduct.toObject();


        responseHandler(res, 201, true, "Product added successfully", productData);
    }catch(error) {
        responseHandler(res, 500, false, "Error adding product", null, error.message);
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

        responseHandler(res, 200, true, "Products retrieved successfully", paginatedResponse);
    } catch (error) {
        responseHandler(res, 500, false, "Error fetching products", null, error.message);
    }
};
  
const getProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await Store.findById(id).select("-__v -updatedAt");
      if (!product) return responseHandler(res, 404, false, "Product not found");

      responseHandler(res, 200, true, "Product retrieved successfully", product);
    } catch (error) {
      responseHandler(res, 500, false, "Error fetching product", null, error.message);
    }
  };

const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const updatedProduct = await Store.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!updatedProduct) return responseHandler(res, 404, false, "Product not found");

        responseHandler(res, 200, true, "Product updated successfully", updatedProduct);
    }catch (error){
        responseHandler(res, 500, false, "Error updating product", null, error.message);
    }
};

const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Store.findByIdAndDelete(id);
        if(!product) return responseHandler(res, 404, false, "Product not found");

        const { productName } = product;
        responseHandler(res, 200, true, `Product '${productName}' has been deleted`);
    }catch (error){
        responseHandler(res, 500, false, "Error deleting product", null, error.message);
    }
};

module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct };
