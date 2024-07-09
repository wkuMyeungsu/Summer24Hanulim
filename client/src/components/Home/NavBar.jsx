import React, { useState } from "react";

function AgeGroupSelector({ sheetNames, selectedAgeGroup, onAgeGroupSelect }) {
  return (
    <ul className="age-group-selector">
      {sheetNames.map((name) => (
        <li
          key={name}
          className={selectedAgeGroup === name ? "selected" : ""}
          onClick={() => onAgeGroupSelect(name)}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function NavBar({
  sheetNames,
  selectedAgeGroup,
  onAgeGroupSelect,
  setIsInputFocused,
  onSearch,
}) {
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
      <AgeGroupSelector
        sheetNames={sheetNames}
        selectedAgeGroup={selectedAgeGroup}
        onAgeGroupSelect={onAgeGroupSelect}
      />
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="셀 리더 이름"
          id="searchInput"
          aria-label="셀 리더 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">검색</button>
      </form>
    </nav>
  );
}
