const { google } = require("googleapis");
const { API_KEY, SPREADSHEET_ID } = require("./config");

const sheets = google.sheets({ version: "v4", auth: API_KEY });

// ... (기존 코드는 그대로 유지)

async function editCellData(sheetName, searchValue1, searchValue2, newData) {
  try {
    // 1. 시트의 모든 데이터를 가져옵니다.
    const sheetData = await fetchSpreadsheetData(sheetName);
    const values = sheetData.values;

    // 2. 첫 번째 열과 두 번째 열이 모두 일치하는 행을 찾습니다.
    let targetRowIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === searchValue1 && values[i][1] === searchValue2) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      console.log("검색 값을 찾을 수 없습니다.");
      return;
    }

    // 3. 찾은 행의 데이터를 새 데이터로 덮어씁니다.
    const updateRange = `${sheetName}!A${targetRowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newData],
      },
    });

    console.log("데이터가 성공적으로 수정되었습니다.");

    // 4. 연결된 클라이언트들에게 업데이트를 알립니다.
    handleSheetUpdate({
      type: "edit",
      sheetName,
      rowIndex: targetRowIndex,
      newData,
    });
  } catch (error) {
    console.error("에러 발생:", error);
    throw new Error(`Failed to edit data: ${error.message}`);
  }
}

async function findAndInsertRowData(
  sheetName,
  searchValue1,
  searchValue2,
  newData
) {
  try {
    // 1. 시트의 모든 데이터를 가져옵니다.
    const sheetData = await fetchSpreadsheetData(sheetName);
    const values = sheetData.values;

    // 2. 첫 번째 열과 두 번째 열이 모두 일치하는 행을 찾습니다.
    let targetRowIndex = -1;
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === searchValue1 && values[i][1] === searchValue2) {
        targetRowIndex = i;
        break;
      }
    }

    if (targetRowIndex === -1) {
      console.log("검색 값을 찾을 수 없습니다.");
      return;
    }

    // 3. 찾은 셀 바로 아래에 새 행을 삽입합니다.
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: await getSheetId(SPREADSHEET_ID, sheetName),
                dimension: "ROWS",
                startIndex: targetRowIndex + 1,
                endIndex: targetRowIndex + 2,
              },
            },
          },
        ],
      },
    });

    // 4. 삽입된 새 행에 데이터를 추가합니다.
    const insertRange = `${sheetName}!A${targetRowIndex + 2}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: insertRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newData],
      },
    });

    console.log("새 행이 삽입되고 데이터가 성공적으로 추가되었습니다.");

    // 5. 연결된 클라이언트들에게 업데이트를 알립니다.
    handleSheetUpdate({
      type: "insert",
      sheetName,
      rowIndex: targetRowIndex + 1,
      newData,
    });
  } catch (error) {
    console.error("에러 발생:", error);
    throw new Error(`Failed to insert data: ${error.message}`);
  }
}

async function getSheetId(spreadsheetId, sheetName) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
  });

  const sheet = response.data.sheets.find(
    (s) => s.properties.title === sheetName
  );
  return sheet ? sheet.properties.sheetId : null;
}

module.exports = {
  fetchSheetNames,
  fetchSpreadsheetData,
  handleSSEConnection,
  handleSheetUpdate,
  findAndEditCellData: editCellData,
  findAndInsertRowData,
};
