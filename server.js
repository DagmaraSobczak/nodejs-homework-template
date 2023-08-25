require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3000;
const SRV_DB = process.env.SRV_DB;

mongoose
  .connect(SRV_DB, {
    dbName: "db-contacts",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: " + PORT);
      console.log("Database connection successful");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
