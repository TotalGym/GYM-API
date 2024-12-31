const express = require('express');
const dbConnection = require("./config/database");
const dotenv = require("dotenv");

const errorHandler = require("./middlewares/error.middleware.js");
const routes = require('./utils/routes');
const { authenticate } = require('./middlewares/authenticate.js');
const authorizeRole = require('./middlewares/authorize.middleware.js');


dotenv.config();

//connect to databse
dbConnection();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/equipment', routes.equipmentRoutes);
app.use('/api/store', routes.storeRoutes);
app.use('/api/salesHistory', routes.salesHistoryRoutes);
app.use('/api/programs', routes.programsRoutes);
app.use('/api/trainee', routes.traineeRoutes);
app.use('/api/staff', authenticate, routes.staffRoutes)
app.use('/api/admin',authenticate ,authorizeRole(["SuperAdmin"]), routes.adminRoutes);
app.use('/api/auth', routes.authRoutes);


app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

//local get
app.get('/', (req, res)=> {
    res.send("Welcome to GYM API!")
})