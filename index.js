const express = require('express');
const dbConnection = require("./config/database");
const dotenv = require("dotenv");

const errorHandler = require("./middlewares/error.middleware.js");
const equipmentRoutes = require('./routes/equipment.route.js');
const storeRoutes = require('./routes/store.route.js');
const salesHistoryRoutes = require('./routes/salesHistory.route.js');
const programsRoutes = require('./routes/programs.route.js');
const traineeRoutes = require('./routes/trainee.route.js');
const { authenticate } = require('./middlewares/authenticate.js');


dotenv.config();

//connect to databse
dbConnection();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/equipment', equipmentRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/salesHistory', salesHistoryRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/trainee', authenticate, traineeRoutes);
//admin route


app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

//local get
app.get('/', (req, res)=> {
    res.send("Welcome to GYM API!")
})