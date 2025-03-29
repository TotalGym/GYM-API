const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = [
  process.env.PRODUCTION_BUILD,
  process.env.DEVELOPMENT_BUILD,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
