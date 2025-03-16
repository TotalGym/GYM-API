const Trainee = require("../../models/trainee.model.js");
const schedule = require("node-schedule");

const markAbsentees = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trainees = await Trainee.find({});

    for (const trainee of trainees) {
      const hasCheckedIn = trainee.attendance.some(
        (att) => att.date >= today && att.status === "Present"
      );

      if (!hasCheckedIn) {
        trainee.attendance.push({
          date: today,
          status: "Absent",
        });
        await trainee.save();
      }
    }

    console.log("Absentees marked successfully.");
  } catch (error) {
    console.error("Error marking absentees:", error.message);
  }
};

schedule.scheduleJob("0 0 * * *", markAbsentees); // Runs at 00:00 every day

module.exports = { markAbsentees };
