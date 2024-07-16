import React from "react";

export default function MemberList({ members, onMemberClick, isModalOpen }) {
  return (
    <div className="member-list">
      <h2>셀 멤버</h2>
      <ul>
        {members.map((member, index) => (
          <li
            key={index}
            onClick={() => !isModalOpen && onMemberClick(member)}
            className={isModalOpen ? "disabled" : ""}
          >
            {member.name} - {member.status ? member.status : "미정"}
          </li>
        ))}
      </ul>
    </div>
  );
}
