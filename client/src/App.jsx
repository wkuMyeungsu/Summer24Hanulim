import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import DynamicView from "./components/DynamicView";
import Footer from "./components/Footer";

export default function App() {
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [initialWindowHeight, setInitialWindowHeight] = useState(
    window.innerHeight,
  );

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        // 모바일 환경으로 간주
        setIsFooterVisible(window.innerHeight > initialWindowHeight - 100);
      } else {
        setIsFooterVisible(true); // 데스크톱에서는 항상 보이게
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 실행

    return () => window.removeEventListener("resize", handleResize);
  }, [initialWindowHeight]);

  useEffect(() => {
    setInitialWindowHeight(window.innerHeight);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <>
      <Header />
      <DynamicView />
      <Footer isVisible={isFooterVisible} />
    </>
  );
}
