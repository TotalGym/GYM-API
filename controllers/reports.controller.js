//TODO: Refactor reports to provide to new informations

exports.generateTraineeReport = async (req, res) => {
  try {
    const paginatedData = res.paginatedResults.results;
    const reportData = paginatedData.map(trainee => ({
      Name: trainee.name,
      Email: trainee.contact.email,
      MembershipStartDate: trainee.membership.startDate,
      MembershipEndDate: trainee.membership.endDate,
      SelectedPrograms: trainee.selectedPrograms.map(program => program.programName),
    }));

    res.status(200).json({
      reportName: "Trainee Report",
      totalCount: res.paginatedResults.totalCount,
      next: res.paginatedResults.next,
      previous: res.paginatedResults.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate trainee report", error: error.message });
  }
};


exports.generateEquipmentReport = async (req, res) => {
  try {
    const paginatedData = res.paginatedResults.results;
    const reportData = paginatedData.map(eq => ({
      Name: eq.name,
      Quantity: eq.quantity,
      Status: eq.status,
    }));

    res.status(200).json({
      reportName: "Equipment Report",
      totalCount: res.paginatedResults.totalCount,
      next: res.paginatedResults.next,
      previous: res.paginatedResults.previous,
      reportData,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate equipment report", error: error.message });
  }
};

exports.generateStaffReport = async (req, res) => {
    try {
      const paginatedData = res.paginatedResults.results;
      const reportData = paginatedData.map(staff => ({
        Name: staff.name,
        Role: staff.role,
        Email: staff.contact.email,
      }));
  
      res.status(200).json({
        reportName: "Staff Report",
        totalCount: res.paginatedResults.totalCount,
        next: res.paginatedResults.next,
        previous: res.paginatedResults.previous,
        reportData,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate staff report", error: error.message });
    }
};


exports.generateProgramsReport = async (req, res) => {
    try {
      const paginatedData = res.paginatedResults.results;
      const reportData = paginatedData.map(program => ({
        ProgramName: program.programName,
        Description: program.description,
        RegisteredTrainees: program.registeredTrainees.map(trainee => ({
          Name: trainee.name,
          Email: trainee.contact.email,
        })),
      }));
  
      res.status(200).json({
        reportName: "Programs Report",
        totalCount: res.paginatedResults.totalCount,
        next: res.paginatedResults.next,
        previous: res.paginatedResults.previous,
        reportData,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate programs report", error: error.message });
    }
};


exports.generatePaymentsReport = async (req, res) => {
    try {
        const paginatedData = res.paginatedResults.results;
        const reportData = paginatedData.map(payment => ({
        TraineeName: payment.TraineeID.name,
        TraineeEmail: payment.TraineeID.contact.email,
        Amount: payment.Amount,
        Status: payment.Status,
        DueDate: payment.DueDate,
        PaymentDate: payment.PaymentDate,
        }));

        res.status(200).json({
        reportName: "Payments Report",
        totalCount: res.paginatedResults.totalCount,
        next: res.paginatedResults.next,
        previous: res.paginatedResults.previous,
        reportData,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate payments report", error: error.message });
    }
};


exports.generateStoreReport = async (req, res) => {
    try {
      const paginatedData = res.paginatedResults.results;
      const reportData = paginatedData.map(product => ({
        ProductName: product.productName,
        InventoryCount: product.inventoryCount,
      }));
  
      res.status(200).json({
        reportName: "Store Inventory Report",
        totalCount: res.paginatedResults.totalCount,
        next: res.paginatedResults.next,
        previous: res.paginatedResults.previous,
        reportData,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate store report", error: error.message });
    }
};