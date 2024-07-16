import "./HomePage.css";
import React, { useState, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import CellList from "./CellList";
import { useNavigate } from "react-router-dom";

export default function HomePage({ allCellData, sheetNames }) {
  const navigate = useNavigate();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(allCellData);

  const handleAgeGroupSelect = useCallback((ageGroup) => {
    setSelectedAgeGroup((prevSelected) =>
      prevSelected === ageGroup ? null : ageGroup
    );
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleCellClick = useCallback(
    (cellName, sheetName) => {
      navigate(`/managecell/${sheetName}/${cellName}`);
    },
    [navigate]
  );

  const filteredCellData = useMemo(() => {
    let filteredData = selectedAgeGroup
      ? { [selectedAgeGroup]: allCellData[selectedAgeGroup] }
      : allCellData;

    if (searchTerm) {
      filteredData = Object.entries(filteredData).reduce(
        (acc, [key, value]) => {
          const filteredCells = value.cells.filter((cell) =>
            cell.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (filteredCells.length > 0) {
            acc[key] = { ...value, cells: filteredCells };
          }
          return acc;
        },
        {}
      );
    }

    return filteredData;
  }, [selectedAgeGroup, allCellData, searchTerm]);

  return (
    <>
      <NavBar
        sheetNames={sheetNames}
        selectedAgeGroup={selectedAgeGroup}
        onAgeGroupSelect={handleAgeGroupSelect}
        onSearch={handleSearch}
      />
      <CellList cellData={filteredCellData} onCellClick={handleCellClick} />
    </>
  );
}
