const express = require("express");
const router = express.Router();
const googleSheetService = require("./service");

router.get("/sheetNames", async (req, res) => {
  try {
    const sheetNames = await googleSheetService.fetchSheetNames();
    res.json(sheetNames);
  } catch (error) {
    console.error("Detailed error in /sheetNames:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/spreadsheetData/:sheetName", async (req, res) => {
  try {
    const data = await googleSheetService.fetchSpreadsheetData(
      req.params.sheetName
    );
    res.json(data);
  } catch (error) {
    console.error(
      `Detailed error in /spreadsheetData/${req.params.sheetName}:`,
      error
    );
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

module.exports = router;
