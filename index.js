const express = require('express');
const dbConnection = require("./config/database");
const dotenv = require("dotenv");

dotenv.config();

//connect to databse
dbConnection();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

//local get
app.get('/', (req, res)=> {
    res.send("Welcome to GYM API!")
})