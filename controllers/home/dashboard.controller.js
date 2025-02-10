const Trainee = require("../../models/trainee.model.js");
const Payment = require("../../models/payments.model.js");
const Equipment = require("../../models/equipment.model.js");
const Program = require("../../models/programs.model.js");
const { responseHandler } = require("../../utils/responseHandler.js");

exports.dashboardHomePage = async (req, res) => {
  try {
    const [traineeCount, pendingPaymentsCount, maintenanceEquipmentsCount, totalProgramsCount] = await Promise.all([
      Trainee.countDocuments(),
      Payment.countDocuments({ Status: "Pending" }),
      Equipment.countDocuments({ status: "Under Maintenance" }),
      Program.countDocuments(),
    ]);

    responseHandler(res, 200, true, "Dashboard stats fetched successfully", {
      trainees: traineeCount,
      pendingPayments: pendingPaymentsCount,
      underMaintenanceEquipments: maintenanceEquipmentsCount,
      totalPrograms: totalProgramsCount,
    });
  } catch (error) {
    responseHandler(res, 500, false, "Error fetching dashboard stats", null, error.message);
  }
};
