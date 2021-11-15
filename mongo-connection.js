const mongoose = require('mongoose');
require("dotenv").config();

const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb://localhost:27017/members-only";

mongoose.connect(CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected🚀"))
  .catch(err => console.log(err))