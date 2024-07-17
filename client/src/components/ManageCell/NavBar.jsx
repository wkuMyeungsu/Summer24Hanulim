import React, { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar({ onSearch, onAddMember, onSort }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSort, setNameSort] = useState("none");
  const [genderSort, setGenderSort] = useState("none");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleNameSort = () => {
    const newSort = nameSort === "none" || nameSort === "desc" ? "asc" : "desc";
    setNameSort(newSort);
    onSort({ name: newSort, gender: genderSort });
  };

  const handleGenderSort = () => {
    const newSort =
      genderSort === "none" || genderSort === "female-first"
        ? "male-first"
        : "female-first";
    setGenderSort(newSort);
    onSort({ name: nameSort, gender: newSort });
  };

  const getNameSortLabel = () => {
    if (nameSort === "asc") return "이름 ▲";
    if (nameSort === "desc") return "이름 ▼";
    return "이름순";
  };

  const getGenderSortLabel = () => {
    if (genderSort === "male-first") return "성별 (남→여)";
    if (genderSort === "female-first") return "성별 (여→남)";
    return "성별순";
  };

  return (
    <nav className="nav-bar">
      <div className="search-bar">
        <input
          type="text"
          placeholder="셀원 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="sort-buttons">
        <button
          onClick={handleNameSort}
          className={nameSort !== "none" ? "active" : ""}
        >
          {getNameSortLabel()}
        </button>
        <button
          onClick={handleGenderSort}
          className={genderSort !== "none" ? "active" : ""}
        >
          {getGenderSortLabel()}
        </button>
      </div>
      <button onClick={onAddMember} className="add-member-btn">
        셀원 추가
      </button>
    </nav>
  );
}

export default NavBar;
