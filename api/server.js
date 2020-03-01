const express = require("express");
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
require("dotenv").config();

const app = express();

installHandler(app);

const port = process.env.API_SERVER_PORT || 3000;

(async () => {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log("ERROR FROM SCRIPT: ", err);
  }
})();
