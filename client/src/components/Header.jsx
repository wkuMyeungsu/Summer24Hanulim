import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <h1 className="header-title">
        <Link to="/">2024 한울림청년부 여름수련회 참석조사</Link>
      </h1>
    </header>
  );
}
