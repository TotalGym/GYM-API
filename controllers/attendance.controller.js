const Trainee = require("../models/trainee.model.js");
const Staff = require("../models/staff.model.js");
const Admin = require("../models/admin.model.js");
const { responseHandler } = require("../utils/responseHandler.js");

exports.handleCheckIn = async (req, res) => {
  const userId = req.user._id;

  try {
    const models = [{ model: Trainee }, { model: Staff }, { model: Admin }];

    let user = null;
    for (const { model } of models) {
      user = await model.findById(userId);

      if (user) {
        break;
      }
    }

    if (!user) return responseHandler(res, 400, false, "Invalid credentials");

    const today = new Date().toISOString().slice(0, 10);
    const alreadyCheckedIn = user.attendance.some((attendance) => {
      return attendance.date.toISOString().slice(0, 10) === today;
    });

    if (alreadyCheckedIn) {
      return responseHandler(
        res,
        400,
        false,
        "You have already checked in today"
      );
    }

    const newAttendance = {
      date: new Date(),
      status: "Present",
    };

    user.attendance.push(newAttendance);
    await user.save();

    await updateStatus(user);

    responseHandler(res, 200, true, "Check-in successful");
  } catch (error) {
    responseHandler(res, 400, false, `${error.message}`);
  }
};

const updateStatus = async (user) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentAttendance = user.attendance.filter(
      (att) => new Date(att.date) >= oneMonthAgo
    );

    const checkInCount = recentAttendance.filter(
      (att) => att.status === "Present"
    ).length;

    if (checkInCount >= 4) {
      user.status = "active";
    } else if (recentAttendance.length >= 0 || recentAttendance.length <= 3) {
      user.status = "new";
    } else {
      user.status = "inactive";
    }

    await user.save();
  } catch (error) {
    console.log("Something wrong happend: ", error.message);
  }
};
