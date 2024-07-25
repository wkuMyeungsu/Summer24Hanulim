import React from "react";
import "./MemberList.css";

export default function MemberList({ members, onMemberClick }) {
  const groupedMembers = members.reduce((acc, member) => {
    const status = member.status || "미정";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(member);
    return acc;
  }, {});

  const dayMapping = {
    day9: "09(금)",
    day10: "10(토)",
    day11: "11(일)",
  };

  const renderMemberList = (memberList) => {
    return memberList.map((member) => (
      <li
        key={member.id}
        onClick={() => onMemberClick(member)}
        className={`member-item ${member.gender === "남" ? "male" : "female"}`}
      >
        <div className="member-summary">
          <div className="member-name">{member.name}</div>
          {member.status === "참석" && (
            <>
              <div className="member-details">
                <span>차량: {member.carUsage || "미정"}</span>
              </div>
              <div className="member-attendance">
                {Object.entries(member.attendance).map(([day, data]) => (
                  <div key={day} className="attendance-day">
                    <span>
                      {dayMapping[day] || day}: {data.present || "미정"}
                    </span>
                    {data.stay && <span> (숙박: {data.stay})</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </li>
    ));
  };

  return (
    <div className="member-list">
      <h2>셀원 목록</h2>
      {["참석", "불참", "미정"].map(
        (status) =>
          groupedMembers[status] &&
          groupedMembers[status].length > 0 && (
            <div key={status} className="status-group">
              <h3 className="status-header">{status}</h3>
              <ul>{renderMemberList(groupedMembers[status])}</ul>
            </div>
          )
      )}
    </div>
  );
}
