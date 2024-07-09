const { google } = require("googleapis");
const { API_KEY, SPREADSHEET_ID } = require("./config");

const sheets = google.sheets({ version: "v4", auth: API_KEY });

async function fetchSheetNames() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets.properties.title",
    });
    return response.data.sheets.map((sheet) => sheet.properties.title);
  } catch (error) {
    console.error("Detailed error in fetchSheetNames:", error);
    throw new Error(`Failed to fetch sheet names: ${error.message}`);
  }
}

async function fetchSpreadsheetData(sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Detailed error in fetchSpreadsheetData for ${sheetName}:`,
      error
    );
    throw new Error(
      `Failed to fetch data for sheet ${sheetName}: ${error.message}`
    );
  }
}

module.exports = {
  fetchSheetNames,
  fetchSpreadsheetData,
};
