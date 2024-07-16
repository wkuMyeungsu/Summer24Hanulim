import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MemberList from "./MemberList";
import MemberEditModal from "./MemberEditModal";
import "./ManageCellPage.css"; // 새로운 CSS 파일 import

export default function ManageCellPage({ allCellData }) {
  const [cellData, setCellData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sheetName, cellName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCellData = allCellData[sheetName]?.cells.find(
      (cell) => cell.name === cellName
    );
    if (selectedCellData) {
      setCellData(selectedCellData);
    } else {
      console.error("Selected cell not found");
      navigate("/"); // 셀을 찾지 못하면 홈페이지로 리다이렉트
    }
  }, [sheetName, cellName, allCellData, navigate]);

  const handleMemberClick = useCallback((member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  }, []);

  const handleMemberEdit = useCallback((editedMember) => {
    // TODO: Implement the logic to update the member data
    console.log("Edited member:", editedMember);
    setIsModalOpen(false);
    // 여기에 멤버 데이터를 업데이트하는 로직을 추가해야 합니다.
    // 예: updateMemberData(editedMember);
  }, []);

  if (!cellData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-cell-page">
      <h1>{cellData.name} 셀 관리</h1>
      <div className="cell-info">
        <p>전체 인원: {cellData.members.length}</p>
        <p>참석 인원: {cellData.participantCount}</p>
        <p>
          미정 인원:{" "}
          {cellData.members.length -
            cellData.participantCount -
            cellData.nonParticipantCount}
        </p>
        <p>불참 인원: {cellData.nonParticipantCount}</p>
      </div>
      <div className="cell-management-container">
        <MemberList
          members={cellData.members}
          onMemberClick={handleMemberClick}
        />
      </div>
      {isModalOpen && (
        <MemberEditModal
          member={selectedMember}
          onSave={handleMemberEdit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
