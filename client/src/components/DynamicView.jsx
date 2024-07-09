import React from "react";
import "./DynamicView.css";
import HomePage from "./Home/HomePage";
import ManageCell from "./ManageCell/ManageCellPage";
import { Routes, Route } from "react-router-dom";

const DynamicView = React.memo(function DynamicView({ setIsInputFocused }) {
  return (
    <div className="dynamic-view">
      <Routes>
        <Route
          path="/"
          element={<HomePage setIsInputFocused={setIsInputFocused} />}
        />
        <Route path="/managecell" element={<ManageCell />} />
      </Routes>
    </div>
  );
});

export default DynamicView;
