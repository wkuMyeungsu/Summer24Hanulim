// DynamicView.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./DynamicView.css";
import HomePage from "./Home/HomePage";
import ManageCell from "./ManageCell/ManageCellPage";
import { Routes, Route } from "react-router-dom";
import { filterSheetData, groupIntoCells } from "./utils";

const DynamicView = React.memo(function DynamicView() {
  const [allCellData, setAllCellData] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheetNames = useCallback(async () => {
    const response = await fetch("/api/sheetNames");
    if (!response.ok) {
      throw new Error("Failed to fetch sheet names");
    }
    return response.json();
  }, []);

  const fetchSheetData = useCallback(async (sheetName) => {
    console.log(sheetName);
    const response = await fetch(
      `/api/spreadsheetData/${encodeURIComponent(sheetName)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data for sheet ${sheetName}`);
    }
    const data = await response.json();
    const { ageGroup, filteredData } = filterSheetData(data.values);
    const cells = groupIntoCells(filteredData);
    return { ageGroup, cells, values: data.values }; // values 추가
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const names = await fetchSheetNames();
      setSheetNames(names);
      const data = {};
      await Promise.all(
        names.map(async (sheetName) => {
          data[sheetName] = await fetchSheetData(sheetName);
        })
      );
      setAllCellData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchSheetNames, fetchSheetData]);

  const handleUpdate = useCallback(
    (update) => {
      setAllCellData((prevData) => {
        const { sheetName, range, value } = update;
        console.log(`Updating ${sheetName}, range: ${range}, value: ${value}`);

        fetchSheetData(sheetName).then((newSheetData) => {
          setAllCellData((prev) => ({ ...prev, [sheetName]: newSheetData }));
        });

        return prevData;
      });
    },
    [fetchSheetData]
  );

  useEffect(() => {
    fetchAllData();

    const eventSource = new EventSource("/api/updates");

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      console.log("Received update:", update);
      handleUpdate(update);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [fetchAllData, handleUpdate]);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div className="dynamic-view">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage allCellData={allCellData} sheetNames={sheetNames} />
          }
        />
        <Route
          path="/managecell/:sheetName/:cellName"
          element={<ManageCell allCellData={allCellData} />}
        />
      </Routes>
    </div>
  );
});

export default DynamicView;
