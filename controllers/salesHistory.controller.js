const SalesHistory = require("../models/salesHistory.model.js");
const Store = require("../models/store.model.js");
const { paginatedResults } = require("../utils/pagination.js");
const { responseHandler } = require("../utils/responseHandler.js");
const { search } = require("../utils/search.js");

exports.Sell = async (req, res) => {
  try {
    const { ProductID, TraineeID, quantitySold } = req.body;
    if (
      !ProductID ||
      !quantitySold ||
      !TraineeID ||
      isNaN(quantitySold) ||
      quantitySold <= 0
    ) {
      return responseHandler(res, 400, false, "Invalid input or missing");
    }

    const product = await Store.findById(ProductID);
    if (!product) {
      return responseHandler(res, 404, false, "Product not found");
    }

    if (product.inventoryCount < quantitySold) {
      return responseHandler(res, 400, false, "Insufficient inventory");
    }

    product.inventoryCount -= quantitySold;
    const totalSaleValue = quantitySold * product.price;
    product.totalRevenue = (product.totalRevenue || 0) + totalSaleValue;

    await product.save();

    const sale = await SalesHistory.create({
      ProductID,
      quantitySold,
      totalSaleValue,
      TraineeID,
    });

    const productData = {
      name: product.productName,
      quantity: product.inventoryCount,
      totalRevenue: product.totalRevenue,
    };

    return responseHandler(res, 201, true, "Sale recorded successfully", {
      sale,
      productData,
    });
  } catch (error) {
    return responseHandler(
      res,
      500,
      false,
      "Failed to record sale",
      null,
      error.message
    );
  }
};
//todo: collect products being sold the most in each month for analytics

exports.getAllSales = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const searchQuery = {
      ...search(SalesHistory, searchTerm),
      ProductID: { $ne: null },
    };

    const options = {
      populateFields: [
        { path: "ProductID", select: "productName" },
        { path: "TraineeID", select: "name email" },
      ],
    };

    const paginatedData = await paginatedResults(
      SalesHistory,
      searchQuery,
      req,
      options
    );

    paginatedData.results = paginatedData.results.filter(
      (sale) => sale.ProductID
    );

    responseHandler(
      res,
      200,
      true,
      "Sales history retrieved successfully",
      paginatedData
    );
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      `Error fetching sales`,
      null,
      error.message
    );
  }
};

exports.getSalesByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const sales = await SalesHistory.find({ ProductID: productId }).populate(
      "ProductID",
      "ProductName"
    );
    responseHandler(
      res,
      200,
      true,
      "Sales history for product retrieved successfully",
      sales
    );
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Failed to retrieve sales",
      null,
      error.message
    );
  }
};

exports.deleteSale = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await SalesHistory.findByIdAndDelete(id);
    if (!sale)
      return responseHandler(res, 404, false, "Sale history not found");

    responseHandler(res, 200, true, "Sale history deleted successfully");
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Failed to delete sale history",
      null,
      error.message
    );
  }
};

exports.getFilteredSales = async (req, res) => {
  try {
    const sales = await SalesHistory.find()
      .populate({
        path: "ProductID",
        select: "ProductName",
      })
      .populate({
        path: "TraineeID",
        select: "Name Contact.Email",
      });
    const formattedSales = sales.map((sale) => ({
      id: sale._id,
      productName: sale.ProductID?.ProductName || null,
      traineeName: sale.TraineeID?.Name || null,
      traineeEmail: sale.TraineeID?.Contact?.Email || null,
      quantitySold: sale.quantitySold,
      price: sale.price,
      totalSaleValue: sale.totalSaleValue,
      saleDate: sale.SaleDate,
    }));

    responseHandler(
      res,
      200,
      true,
      "Filtered sales retrieved successfully",
      formattedSales
    );
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Failed to retrieve filtered sales",
      null,
      error.message
    );
  }
};
