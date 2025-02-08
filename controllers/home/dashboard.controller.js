const Trainee = require("../../models/trainee.model.js");
const Payment = require("../../models/payments.model.js");
const Equipment = require("../../models/equipment.model.js");
const Program = require("../../models/programs.model.js");

exports.dashboardHomePage = async (req, res) => {
  try {
    const [traineeCount, pendingPaymentsCount, maintenanceEquipmentsCount, totalProgramsCount] = await Promise.all([
      Trainee.countDocuments(),
      Payment.countDocuments({ Status: "Pending" }),
      Equipment.countDocuments({ status: "Under Maintenance" }),
      Program.countDocuments(),
    ]);

    res.status(200).json({
      trainees: traineeCount,
      pendingPayments: pendingPaymentsCount,
      underMaintenanceEquipments: maintenanceEquipmentsCount,
      totalPrograms: totalProgramsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};
