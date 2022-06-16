const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();


// app
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator()); 
app.use(cors());


// import routes
const userRoutes = require("./routes/user");

// app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = 8001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
