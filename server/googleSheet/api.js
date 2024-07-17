// api.js
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

router.post("/editSpreadsheetData", async (req, res) => {
  try {
    const { sheetName, rowNumber, newData } = req.body;
    const result = await googleSheetService.editSpreadsheetData(
      sheetName,
      rowNumber,
      newData
    );
    res.json({ success: true, updatedRow: result });
  } catch (error) {
    console.error("Error in /editSpreadsheetData:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.post("/insertSpreadsheetData", async (req, res) => {
  try {
    const { sheetName, rowNumber, newData } = req.body;
    console.log("Received request to insert new data:", {
      sheetName,
      rowNumber,
      newData,
    });

    const result = await googleSheetService.insertSpreadsheetData(
      sheetName,
      rowNumber,
      newData
    );
    console.log("Data inserted successfully:", result);
    res.json({ success: true, insertedRow: result });
  } catch (error) {
    console.error("Error in /insertSpreadsheetData:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// DELETE 메서드로 수정
router.delete("/deleteSpreadsheetRow", async (req, res) => {
  try {
    const { sheetName, rowNumber } = req.query;
    const result = await googleSheetService.deleteSpreadsheetRow(
      sheetName,
      parseInt(rowNumber, 10)
    );
    res.json(result);
  } catch (error) {
    console.error("Error in /deleteSpreadsheetRow:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/updates", googleSheetService.handleSSEConnection);

module.exports = router;
