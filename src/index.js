require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./core/middlewares/error.middleware");
const clickupRoutes = require("./modules/clickUp/routes/clickup.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/tasks", clickupRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
