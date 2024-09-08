const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const todoSchema = require("./schema/todoSchema");
const userSchema = require("./schema/userSchema");

const port = 3000;

// app initialization
const app = express();
dotenv.config();
app.use(express.json());

// connection with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));

//   route handler
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handling
const errorHandling = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  } else {
    res.status(500).json({ error: err });
  }
};
app.use(errorHandling);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
