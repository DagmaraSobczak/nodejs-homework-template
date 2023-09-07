require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const configUpload = require("./config/configUpload");
const fs = require("fs");

const PORT = 3000;
const SRV_DB = process.env.SRV_DB;

const isAccessible = async (folder) => {
  try {
    await fs.access(folder);
    return true;
  } catch {
    return false;
  }
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    try {
      await fs.promises.mkdir(folder, {
        recursive: true,
      });
    } catch (error) {
      console.error(`Error creating folder: ${error.message}`);
    }
  } else {
    console.log("Directories are already created");
  }
};
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
      createFolderIsNotExist(configUpload.AVATARS_PATH);
      createFolderIsNotExist(configUpload.TMP_DIR);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
