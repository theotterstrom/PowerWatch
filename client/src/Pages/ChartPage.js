import React from "react";
import { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Row, Col, Tab, Tabs, Dropdown } from "react-bootstrap";
const LineChart = () => {
  const [fill, setFill] = useState(window.innerWidth < 767);

  useEffect(() => {
    const handleResize = () => {
      setFill(window.innerWidth < 767);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
     
    </>
  );
};

export default LineChart;