const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const URI = process.env.MONGODB_URI;

const dbConnection = () => {
  mongoose.connect(URI)
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  }).catch((err)=>{
    console.log(`Error connecting to database`, err.message)
  });
}

module.exports = dbConnection;