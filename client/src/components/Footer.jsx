import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer({ isVisible }) {
  if (!isVisible) return null;

  return (
    <footer>
      <Link to="/statistics" className="statistics-link">
        <h1 className="footer-title">참석 조사 현황</h1>
      </Link>
    </footer>
  );
}
