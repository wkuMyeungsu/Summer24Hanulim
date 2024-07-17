import React from "react";

export default function CellList({ cellData, onCellClick }) {
  const handleCellClick = (cellName, sheetName, event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Cell clicked:", cellName, sheetName); // 디버깅을 위한 로그
    if (onCellClick) {
      onCellClick(cellName, sheetName);
    }
  };

  const renderCellInfo = (cell, sheetName) => {
    const totalMembers = cell.members.length;
    const participantCount = cell.participantCount;
    const nonParticipantCount = cell.nonParticipantCount;
    const unknownCount = totalMembers - participantCount - nonParticipantCount;

    return (
      <li
        className="cell-summary"
        key={cell.name}
        onClick={(event) => handleCellClick(cell.name, sheetName, event)}
        style={{ cursor: "pointer" }}
      >
        <h3 className="cell-name">{cell.name} 셀</h3>
        <div className="participant-info">
          <div className="info-row">
            <p>전체 인원: {totalMembers}</p>
            <p>참석 인원: {participantCount}</p>
          </div>
          <div className="info-row">
            <p>미정 인원: {unknownCount}</p>
            <p>불참 인원: {nonParticipantCount}</p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="cell-list-container">
      {Object.entries(cellData).map(([sheetName, data]) => (
        <div key={sheetName} className={`age-group ${sheetName}`}>
          <h2 className="age-group-header">{sheetName}</h2>
          {data && data.cells && data.cells.length > 0 ? (
            <ul className="cell-list">
              {data.cells.map((cell) => renderCellInfo(cell, sheetName))}
            </ul>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </div>
      ))}
    </div>
  );
}
