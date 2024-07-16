import React, { useState } from "react";

export default function NavBar({ onSearch, onAddMember }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      onSearch(""); // Clear the filter when input is empty
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="nav-bar">
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="셀원 이름"
          id="searchInput"
          aria-label="셀원 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">검색</button>
      </form>
      <button onClick={onAddMember} className="add-member-button">
        셀원 추가
      </button>
    </nav>
  );
}
