//TODO: Refactor reports to provide to new informations
const Payment = require('../models/payments.model');
const Program = require('../models/programs.model');
const Trainee = require('../models/trainee.model');
const Equipment = require('../models/equipment.model.js');
const Staff = require('../models/staff.model.js');
const Store = require('../models/store.model.js');
const { paginatedResults } = require('../utils/pagination');
const { search } = require('../utils/search');

exports.generateTraineeReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Trainee, searchTerm);

    const paginatedData = await paginatedResults(Trainee, searchQuery, req, { 
      populateFields: [{ path: "selectedPrograms", select: "programName" }]
    });

    const reportData = paginatedData.results.map(trainee => ({
      Name: trainee.name,
      Email: trainee.contact.email,
      MembershipStartDate: trainee.membership.startDate,
      MembershipEndDate: trainee.membership.endDate,
      SelectedPrograms: trainee.selectedPrograms.map(program => program.programName), 
    }));

    res.status(200).json({
      reportName: "Trainee Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate trainee report", error: error.message });
  }
};

exports.generateEquipmentReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Equipment, searchTerm);

    const paginatedData = await paginatedResults(Equipment, searchQuery, req);
    
    const reportData = paginatedData.results.map(eq => ({
      Name: eq.name,
      Quantity: eq.quantity,
      Status: eq.status,
    }));

    res.status(200).json({
      reportName: "Equipment Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate equipment report", error: error.message });
  }
};

exports.generateStaffReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Staff, searchTerm);  // Use search function

    const paginatedData = await paginatedResults(Staff, searchQuery, req);
    
    const reportData = paginatedData.results.map(staff => ({
      Name: staff.name,
      Role: staff.role,
      Email: staff.contact.email,
      Payment: staff.payroll
    }));

    res.status(200).json({
      reportName: "Staff Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate staff report", error: error.message });
  }
};

exports.generateProgramsReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Program, searchTerm);

    const paginatedData = await paginatedResults(Program, searchQuery, req, { 
      populateFields: [{ path: "registeredTrainees", select: "name contact" }]
    });

    const reportData = paginatedData.results.map(program => ({
      ProgramName: program.programName,
      Description: program.description,
      Exercises: program.exercises,
      Schedule: program.schedule,
      Image: program.image,
      RegisteredTrainees: program.registeredTrainees.map(trainee => ({
        Name: trainee.name,
        Email: trainee.contact.email,
      })),
    }));

    res.status(200).json({
      reportName: "Programs Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate programs report", error: error.message });
  }
};

exports.generatePaymentsReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Payment, searchTerm);

    const paginatedData = await paginatedResults(Payment, searchQuery, req, {
      populateFields: [{ path: "TraineeID", select: "name contact.email" }]
    });

    const reportData = paginatedData.results.map(payment => ({
      TraineeName: payment.TraineeID?.name,
      TraineeEmail: payment.TraineeID.contact?.email,
      Amount: payment?.Amount,
      Status: payment?.Status,
      DueDate: payment?.DueDate,
      PaymentDate: payment?.PaymentDate,
    }));

    res.status(200).json({
      reportName: "Payments Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate payments report", error: error.message });
  }
};

exports.generateStoreReport = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const searchQuery = search(Store, searchTerm);

    const paginatedData = await paginatedResults(Store, searchQuery, req);

    const reportData = paginatedData.results.map(product => ({
      ProductName: product.productName,
      InventoryCount: product.inventoryCount,
    }));

    res.status(200).json({
      reportName: "Store Inventory Report",
      totalCount: paginatedData.totalCount,
      next: paginatedData.next,
      previous: paginatedData.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate store report", error: error.message });
  }
};