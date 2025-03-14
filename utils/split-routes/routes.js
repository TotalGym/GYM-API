const equipmentRoutes = require('../../routes/equipment.route.js');
const storeRoutes = require('../../routes/store.route.js');
const salesHistoryRoutes = require('../../routes/salesHistory.route.js');
const programsRoutes = require('../../routes/programs.route.js');
const traineeRoutes = require('../../routes/trainee.route.js');
const adminRoutes = require('../../routes/admin.route.js');
const authRoutes = require('../../routes/auth.route.js');
const staffRoutes = require('../../routes/staff.route.js');
const paymentRoutes = require('../../routes/payments.route.js');
const reportRoutes = require('../../routes/reports.route.js');
const notificationRoutes = require('../../routes/notification.route.js');
const dashboardHome =  require('../../routes/home/dashboard.route.js');
const appHome =  require('../../routes/home/app.route.js');
const profileRoutes = require('../../routes/profile.route.js');


module.exports = {
  equipmentRoutes,
  storeRoutes,
  salesHistoryRoutes,
  programsRoutes,
  traineeRoutes,
  adminRoutes,
  authRoutes,
  staffRoutes,
  paymentRoutes,
  reportRoutes,
  notificationRoutes,
  dashboardHome,
  appHome,
  profileRoutes,
};
