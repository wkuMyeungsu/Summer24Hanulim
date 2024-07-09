import React from "react";

export default function CellList({ cellData }) {
  const renderCellInfo = (cell) => {
    const totalMembers = cell.members.length;
    const participantCount = cell.participantCount;
    const nonParticipantCount = cell.nonParticipantCount;
    const unknownCount = totalMembers - participantCount - nonParticipantCount;

    return (
      <li className="cell-summary" key={cell.name}>
        <h3 className="cell-name">{cell.name} 셀</h3>
        <div className="participant-info">
          <div className="info-row">
            <p>전체 인원: {totalMembers}</p>
            <p>참석 인원: {participantCount}</p>
          </div>
          <div className="info-row">
            <p>미조사 인원: {unknownCount}</p>
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
            <ul className="cell-list">{data.cells.map(renderCellInfo)}</ul>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </div>
      ))}
    </div>
  );
}
