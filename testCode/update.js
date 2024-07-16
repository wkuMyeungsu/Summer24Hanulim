// service.js (대폭 수정된 버전)

async function editSheetData(sheetName, rowNumber, newData) {
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

async function insertSheetData(sheetName, rowNumber, newData) {
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

module.exports = {
  // ... (기존 내보내기)
  editSheetData,
  insertSheetData,
};
