const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({extended:false}))


//local get
app.get('/', (req, res)=> {
    res.send("Welcome to GYM API!")
})

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;


mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log("MongoDB connected successfully.");
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });