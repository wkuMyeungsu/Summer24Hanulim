import "./HomePage.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavBar from "./NavBar";
import CellList from "./CellList";
import { filterSheetData, groupIntoCells } from "./utils.js";

export default function HomePage() {
  const [sheetNames, setSheetNames] = useState([]);
  const [allCellData, setAllCellData] = useState({});
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheetNames = useCallback(async () => {
    const response = await fetch("/api/sheetNames");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch sheet names: ${response.statusText}`);
    }
    return response.json();
  }, []);

  const fetchSheetData = useCallback(async (sheetName) => {
    const response = await fetch(
      `/api/spreadsheetData/${encodeURIComponent(sheetName)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data for sheet ${sheetName}`);
    }
    return response.json();
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const names = await fetchSheetNames();
      setSheetNames(names);

      const allData = {};
      await Promise.all(
        names.map(async (sheetName) => {
          try {
            const data = await fetchSheetData(sheetName);
            if (data && data.values) {
              const { ageGroup, filteredData } = filterSheetData(data.values);
              const cells = groupIntoCells(filteredData);
              allData[sheetName] = { cells, ageGroup };
            }
          } catch (err) {
            console.error(`Error fetching data for sheet ${sheetName}:`, err);
            allData[sheetName] = { error: err.message };
          }
        })
      );

      setAllCellData(allData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchSheetNames, fetchSheetData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAgeGroupSelect = useCallback((ageGroup) => {
    setSelectedAgeGroup((prevSelected) =>
      prevSelected === ageGroup ? null : ageGroup
    );
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

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

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <>
      <NavBar
        sheetNames={sheetNames}
        selectedAgeGroup={selectedAgeGroup}
        onAgeGroupSelect={handleAgeGroupSelect}
        onSearch={handleSearch}
      />
      <CellList cellData={filteredCellData} />
    </>
  );
}
