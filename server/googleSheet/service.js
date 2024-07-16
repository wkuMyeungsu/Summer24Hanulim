// service.js
const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const { SPREADSHEET_ID, CLIENT_EMAIL, PRIVATE_KEY } = require("./config");

const jwtClient = new JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: jwtClient });

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

async function editSpreadsheetData(sheetName, rowNumber, newData) {
  try {
    const updateRange = `${sheetName}!A${rowNumber}:${getColumnLetter(
      newData.length
    )}${rowNumber}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: "RAW",
      resource: { values: [newData] },
    });

    console.log(
      `Row ${rowNumber} updated successfully with ${newData.length} columns`
    );
    return rowNumber;
  } catch (error) {
    console.error("Error in editSheetData:", error);
    throw error;
  }
}

async function insertSpreadsheetData(sheetName, rowNumber, newData) {
  try {
    // 1. 새 행을 삽입합니다.
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: await getSheetId(SPREADSHEET_ID, sheetName),
                dimension: "ROWS",
                startIndex: rowNumber - 1, // 0-based index
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    // 2. 삽입된 새 행에 데이터를 추가합니다.
    const insertRange = `${sheetName}!A${rowNumber}:${getColumnLetter(
      newData.length
    )}${rowNumber}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: insertRange,
      valueInputOption: "RAW",
      resource: { values: [newData] },
    });

    console.log(
      `New row inserted and updated successfully at row ${rowNumber} with ${newData.length} columns`
    );
    return rowNumber;
  } catch (error) {
    console.error("Error in insertSheetData:", error);
    throw error;
  }
}

// 열 번호를 알파벳으로 변환하는 유틸리티 함수
function getColumnLetter(columnNumber) {
  let columnLetter = "";
  while (columnNumber > 0) {
    columnNumber--;
    columnLetter = String.fromCharCode(65 + (columnNumber % 26)) + columnLetter;
    columnNumber = Math.floor(columnNumber / 26);
  }
  return columnLetter;
}

// sheetId를 가져오는 유틸리티 함수 (insertSheetData에서 사용)
async function getSheetId(spreadsheetId, sheetName) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  });

  const sheet = response.data.sheets.find(
    (s) => s.properties.title === sheetName
  );
  return sheet ? sheet.properties.sheetId : null;
}

// SSE 관련 코드
let clients = [];

function handleSSEConnection(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };

  clients.push(newClient);

  req.on("close", () => {
    clients = clients.filter((client) => client.id !== clientId);
  });
}

function sendUpdateToClients(update) {
  clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(update)}\n\n`);
  });
}

module.exports = {
  fetchSheetNames,
  fetchSpreadsheetData,
  handleSSEConnection,
  sendUpdateToClients,
  editSpreadsheetData,
  insertSpreadsheetData,
};
