const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
const cors = require("./config/cors");
const rateLimiter = require("./middlewares/rateLimiter");

const errorHandler = require("./middlewares/error.middleware.js");

const dashboardRoutes = require("./utils/split-routes/dashboard.routes.js");
const appRoutes = require("./utils/split-routes/app.routes.js");
const testHashing = require("./test/testHashing.js");

dotenv.config();

dbConnection();

const app = express();

app.use(cors);
app.use(rateLimiter);

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
