require("dotenv").config();

module.exports = {
  SPREADSHEET_ID: process.env.SPREADSHEET_ID,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  PRIVATE_KEY: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
};
