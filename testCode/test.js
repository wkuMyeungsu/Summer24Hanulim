const handleMemberEdit = useCallback(
  async (editedMember) => {
    setIsModalOpen(false);
    setIsLoading(true);
    setError(null);
    try {
      await editMemberData(editedMember);
      await refetchData();
      loadCellData();
    } catch (err) {
      setError("Failed to update member data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  },
  [sheetName, allCellData, refetchData, loadCellData]
);

async function editMemberData(editedMember) {
  const sheetValues = allCellData[sheetName].values;
  const rowIndex = findRowById(sheetValues, editedMember.id);
  const rowNumber = rowIndex + 1; // 실제 시트의 행 번호로 변환

  const response = await fetch("/api/editSpreadsheetData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sheetName: sheetName,
      rowNumber: rowNumber,
      newData: [
        editedMember.id,
        editedMember.name,
        editedMember.gender,
        editedMember.status,
        editedMember.carUsage,
        editedMember.attendance.day9.present,
        editedMember.attendance.day9.stay,
        editedMember.attendance.day10.present,
        editedMember.attendance.day10.stay,
        editedMember.attendance.day11.present,
        editedMember.meal.day9.dinner,
        editedMember.meal.day10.breakfast,
        editedMember.meal.day10.lunch,
        editedMember.meal.day10.dinner,
        editedMember.meal.day11.breakfast,
        editedMember.notes,
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update member data");
  }

  const result = await response.json();
  console.log("Member data updated successfully:", result);
}
