import React from "react";
import "./Footer.css";

export default function Footer({ isVisible }) {
  if (!isVisible) return null;

  return (
    <footer>
      <h1 className="footer-title">한울림 청년부</h1>
    </footer>
  );
}
