import React from "react";
import "./MemberList.css";

export default function MemberList({ members, onMemberClick }) {
  return (
    <div className="member-list">
      <h2>셀 멤버</h2>
      <ul>
        {members.map((member) => (
          <li
            key={member.id}
            onClick={() => onMemberClick(member)}
            className={`member-item ${
              member.gender === "남" ? "male" : "female"
            }`}
          >
            <div className="member-summary">
              <div className="member-name">{member.name}</div>
              <div className="member-status">{member.status || "미정"}</div>
              <div className="member-details">
                <span>성별: {member.gender}</span>
                <span>차량: {member.carUsage || "미정"}</span>
              </div>
              <div className="member-attendance">
                {Object.entries(member.attendance).map(([day, data]) => (
                  <div key={day} className="attendance-day">
                    <span>
                      {day}: {data.present || "미정"}
                    </span>
                    {data.stay && <span> (숙박: {data.stay})</span>}
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
