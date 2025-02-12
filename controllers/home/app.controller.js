const Program = require('../../models/programs.model.js');
const Store = require('../../models/store.model.js');
const { responseHandler } = require('../../utils/responseHandler.js');

exports.AppHomePage = async (req, res) => {
    try {
        const programs = await Program.find().select("-_id programName description image monthlyPrice annuallyPrice");
        const products = await Store.find().select("-_id productName image inventoryCount");

        responseHandler(res, 200, true, "Home data retrieved successfully", { programs, products });
    } catch (error) {
        responseHandler(res, 500, false, "Error fetching home data", null, error.message);
    }
};