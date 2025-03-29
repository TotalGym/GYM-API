const Trainee = require("../../models/trainee.model.js");
const Payment = require("../../models/payments.model.js");
const Equipment = require("../../models/equipment.model.js");
const Program = require("../../models/programs.model.js");
const Staff = require("../../models/staff.model.js");
const { responseHandler } = require("../../utils/responseHandler.js");

exports.dashboardHomePage = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalTrainees,
      activeTrainees,
      inactiveTrainees,
      newTrainees,
      newMembersThisMonth,
      pendingPaymentsCount,
      maintenanceEquipmentsCount,
      totalProgramsCount,
      programs,
      availableCoaches,
    ] = await Promise.all([
      Trainee.countDocuments(),
      Trainee.countDocuments({ status: "active" }),
      Trainee.countDocuments({ status: "inactive" }),
      Trainee.countDocuments({ status: "new" }),
      Trainee.countDocuments({
        "membership.startDate": { $gte: firstDayOfMonth },
      }),
      Payment.countDocuments({ Status: "Pending" }),
      Equipment.countDocuments({ status: "Under Maintenance" }),
      Program.countDocuments(),
      Program.find({}, "programName _id").lean(),
      Staff.find({ role: "Coach" }, "name _id").lean(),
    ]);

    const percentage = (count) =>
      totalTrainees > 0 ? ((count / totalTrainees) * 100).toFixed(2) : "0";

    responseHandler(res, 200, true, "Dashboard stats fetched successfully", {
      trainees: totalTrainees,
      traineeStatus: {
        active: `${percentage(activeTrainees)}%`,
        inactive: `${percentage(inactiveTrainees)}%`,
        new: `${percentage(newTrainees)}%`,
      },
      clubEnrollment: {
        newMembers: newMembersThisMonth,
        oldMembers: totalTrainees - newMembersThisMonth,
      },
      pendingPayments: pendingPaymentsCount,
      underMaintenanceEquipments: maintenanceEquipmentsCount,
      totalPrograms: totalProgramsCount,
      programs,
      coaches: availableCoaches,
    });
  } catch (error) {
    responseHandler(
      res,
      500,
      false,
      "Error fetching dashboard stats",
      null,
      error.message
    );
  }
};
