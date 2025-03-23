const schedule = require("node-schedule");
const Trainee = require("../../models/trainee.model.js");

const schedulePaymentVerificationReset = async (trainee) => {
  try {
    if (!trainee.membership || !trainee.membership.endDate) return;

    const endDate = new Date(trainee.membership.endDate);

    if (endDate <= new Date()) return;

    schedule.scheduleJob(endDate, async () => {
      try {
        await Trainee.findByIdAndUpdate(trainee._id, {
          paymentVerification: false,
        });
        console.log(`Payment verification reset for ${trainee.name}`);
      } catch (error) {
        console.error(
          `Error resetting payment verification for ${trainee.name}:`,
          error.message
        );
      }
    });

    console.log(`Scheduled reset for ${trainee.name} on ${endDate}`);
  } catch (error) {
    console.error(
      "Error scheduling payment verification reset:",
      error.message
    );
  }
};

module.exports = { schedulePaymentVerificationReset };
