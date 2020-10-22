const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

//route-level middlewares
const userRoutes = require("./routes/users");

const app = express();

//connect to database
mongoose.connect("mongodb://localhost/provab",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => { console.log("Connected to database!") })
  .catch(() => { console.log("Connection to database failed :(") });

//to parse all req.body as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//route-level middleware handlers
app.use("/api/users", userRoutes);

//export it to use in http node server
module.exports = app;
