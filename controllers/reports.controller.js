const Payment = require('../models/payments.model');
const Program = require('../models/programs.model');
const Trainee = require('../models/trainee.model');
const Equipment = require('../models/equipment.model.js');
const Staff = require('../models/staff.model.js');
const Store = require('../models/store.model.js');
const { paginatedResults } = require('../utils/pagination');
const { search } = require('../utils/search');
const { responseHandler } = require('../utils/responseHandler');

const generateReport = async (model, searchTerm, req, populateFields = [], dataMapper, reportName, res) => {
  try {
    const searchQuery = search(model, searchTerm);
    const paginatedData = await paginatedResults(model, searchQuery, req, { populateFields });

    const reportData = paginatedData.results.map(dataMapper);

    return responseHandler(res, 200, true, "Report generated Sucessfully", {
      reportName,
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    return responseHandler(res, 500, false, `Failed to generate ${reportName.toLowerCase()}`, null, error.message);
  }
};

exports.generateTraineeReport = (req, res) => {
  generateReport(
    Trainee,
    req.query.search || '',
    req,
    [{ path: "selectedPrograms", select: "programName" }],
    (trainee) => ({
      Name: trainee.name,
      Email: trainee.contact.email,
      MembershipStartDate: trainee.membership.startDate,
      MembershipEndDate: trainee.membership.endDate,
      SelectedPrograms: trainee.selectedPrograms.map(p => p.programName),
    }),
    "Trainee Report",
    res
  );
};

exports.generateEquipmentReport = (req, res) => {
  generateReport(
    Equipment,
    req.query.search || '',
    req,
    [],
    (eq) => ({
      Name: eq.name,
      Quantity: eq.quantity,
      Status: eq.status,
    }),
    "Equipment Report",
    res
  );
};

exports.generateStaffReport = (req, res) => {
  generateReport(
    Staff,
    req.query.search || '',
    req,
    [],
    (staff) => ({
      Name: staff.name,
      Role: staff.role,
      Email: staff.contact.email,
      Payment: staff.payroll,
    }),
    "Staff Report",
    res
  );
};

exports.generateProgramsReport = (req, res) => {
  generateReport(
    Program,
    req.query.search || '',
    req,
    [{ path: "registeredTrainees", select: "name contact" }],
    (program) => ({
      ProgramName: program.programName,
      Description: program.description,
      Exercises: program.exercises,
      Schedule: program.schedule,
      Image: program.image,
      RegisteredTrainees: program.registeredTrainees.map(trainee => ({
        Name: trainee.name,
        Email: trainee.contact.email,
      })),
    }),
    "Programs Report",
    res
  );
};

exports.generatePaymentsReport = (req, res) => {
  generateReport(
    Payment,
    req.query.search || '',
    req,
    [{ path: "TraineeID", select: "name contact.email" }],
    (payment) => ({
      TraineeName: payment.TraineeID?.name,
      TraineeEmail: payment.TraineeID?.contact?.email,
      Amount: payment?.Amount,
      Status: payment?.Status,
      DueDate: payment?.DueDate,
      PaymentDate: payment?.PaymentDate,
    }),
    "Payments Report",
    res
  );
};

exports.generateStoreReport = (req, res) => {
  generateReport(
    Store,
    req.query.search || '',
    req,
    [],
    (product) => ({
      ProductName: product.productName,
      InventoryCount: product.inventoryCount,
    }),
    "Store Inventory Report",
    res
  );
};
