import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MemberList from "./MemberList";
import MemberEditModal from "./MemberEditModal";
import NavBar from "./NavBar";
import "./ManageCellPage.css";
import { findRowById } from "../utils";

export default function ManageCellPage({ allCellData, refetchData }) {
  const [cellData, setCellData] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { sheetName, cellName } = useParams();
  const navigate = useNavigate();

  const loadCellData = useCallback(() => {
    const selectedCellData = allCellData[sheetName]?.cells.find(
      (cell) => cell.name === cellName
    );
    if (selectedCellData) {
      setCellData(selectedCellData);
      setFilteredMembers(selectedCellData.members);
    } else {
      console.error("Selected cell not found");
      navigate("/");
    }
  }, [sheetName, cellName, allCellData, navigate]);

  useEffect(() => {
    loadCellData();
  }, [loadCellData]);

  const handleMemberClick = useCallback((member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  }, []);

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

  const handleAddMember = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleAddMemberSubmit = useCallback(
    async (newMember) => {
      setIsAddModalOpen(false);
      setIsLoading(true);
      setError(null);
      try {
        const result = await addNewMemberData(newMember);
        // 서버에서 반환된 ID를 newMember에 할당
        newMember.id = result.newId;
        await refetchData();
        loadCellData();
      } catch (err) {
        setError("Failed to add new member. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [refetchData, loadCellData]
  );

  async function addNewMemberData(newMember) {
    const sheetValues = allCellData[sheetName].values;
    const currentCell = allCellData[sheetName].cells.find(
      (cell) => cell.name === cellName
    );

    if (!currentCell) {
      throw new Error("Current cell not found");
    }

    const newMemberGender = newMember.gender;
    const currentCellLastMember =
      newMemberGender === "여"
        ? currentCell.lastMembers.girl
        : currentCell.lastMembers.man;

    const LastMemberRowIndex = findRowById(
      sheetValues,
      currentCellLastMember.id
    );

    const LastMemberRowNumber = LastMemberRowIndex + 1;

    const response = await fetch("/api/insertSpreadsheetData", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetName: sheetName,
        rowNumber: LastMemberRowNumber + 1,
        newData: [
          newMember.id,
          newMember.name,
          newMember.gender,
          newMember.status,
          newMember.carUsage,
          newMember.attendance.day9.present,
          newMember.attendance.day9.stay,
          newMember.attendance.day10.present,
          newMember.attendance.day10.stay,
          newMember.attendance.day11.present,
          newMember.meal.day9.dinner,
          newMember.meal.day10.breakfast,
          newMember.meal.day10.lunch,
          newMember.meal.day10.dinner,
          newMember.meal.day11.breakfast,
          newMember.notes,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to insert new member data");
    }

    const result = await response.json();
    return result; // { rowNumber, newId }
  }

  const handleSearch = useCallback(
    (searchTerm) => {
      if (!cellData) return;

      if (searchTerm === "") {
        setFilteredMembers(cellData.members);
      } else {
        const filtered = cellData.members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
      }
    },
    [cellData]
  );

  const handleDeleteRow = useCallback(
    async (selectedMember) => {
      setIsModalOpen(false);
      setIsLoading(true);
      setError(null);
      try {
        await deleteMemberRow(selectedMember);
        await refetchData(); // 데이터 다시 가져오기
        loadCellData(); // 셀 데이터 다시 로드
      } catch (err) {
        setError("회원 데이터 삭제에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    },
    [refetchData, loadCellData]
  );

  async function deleteMemberRow(selectedMember) {
    const sheetValues = allCellData[sheetName].values;
    const rowIndex = findRowById(sheetValues, selectedMember.id);

    if (rowIndex === -1) {
      throw new Error("해당 회원 데이터를 찾을 수 없습니다.");
    }

    const rowNumber = rowIndex + 2; // Google Sheets API는 1부터 시작하는 인덱스를 사용

    try {
      const response = await fetch(
        `/api/deleteSpreadsheetRow?sheetName=${sheetName}&rowNumber=${rowNumber}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("회원 데이터 삭제에 실패했습니다");
      }

      const result = await response.json();
      console.log("회원 데이터가 성공적으로 삭제되었습니다:", result);

      return result; // 필요 시 응답 데이터를 처리할 수 있습니다.
    } catch (error) {
      console.error("회원 데이터 삭제 실패:", error);
      throw new Error("회원 데이터 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  }

  if (!cellData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-cell-page">
      <div className="page-header">
        <h2>{cellData.name} 셀 관리</h2>
      </div>
      {isLoading && (
        <div className="loading-overlay">데이터 업데이트 중...</div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="cell-info">
        <div className="info-item">
          <span className="info-label">전체 인원:</span>
          <span className="info-value">{cellData.members.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">참석 인원:</span>
          <span className="info-value">{cellData.participantCount}</span>
        </div>
        <div className="info-item">
          <span className="info-label">미정 인원:</span>
          <span className="info-value">
            {cellData.members.length -
              cellData.participantCount -
              cellData.nonParticipantCount}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">불참 인원:</span>
          <span className="info-value">{cellData.nonParticipantCount}</span>
        </div>
      </div>
      <NavBar onSearch={handleSearch} onAddMember={handleAddMember} />
      <div className="cell-management-container">
        <MemberList
          members={filteredMembers}
          onMemberClick={handleMemberClick}
        />
      </div>
      {isModalOpen && (
        <MemberEditModal
          member={selectedMember}
          onSave={handleMemberEdit}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDeleteRow} // Ensure this line is present
        />
      )}
      {isAddModalOpen && (
        <MemberEditModal
          member={null}
          onSave={handleAddMemberSubmit}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
