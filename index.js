const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");

const errorHandler = require("./middlewares/error.middleware.js");

const dashboardRoutes = require("./utils/split-routes/dashboard.routes.js");
const appRoutes = require("./utils/split-routes/app.routes.js");

dotenv.config();

//connect to databse
dbConnection();

const app = express();

const allowedOrigins = [
  process.env.PRODUCTION_BUILD,
  process.env.DEVELOPMENT_BUILD,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to GYM API!");
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/app", appRoutes);

app.use(errorHandler);

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
