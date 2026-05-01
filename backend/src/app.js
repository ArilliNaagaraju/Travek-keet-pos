const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const logger = require("./utils/logger");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;
