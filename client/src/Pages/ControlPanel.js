import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Row, Col } from "react-bootstrap";
import apiUrl from '../Components/Helpers/APIWrapper'
import axios from 'axios';
import ControlPanelPop from '../Components/Children/ControlPanelPop';

const PopUp = React.memo(({ showWindow, method, devices }) => {
  return <ControlPanelPop showWindow={showWindow} method={method} devices={devices} />
});

const ControlPanel = () => {

  const [expanded, setExpanded] = useState(false);
  const [devices, setDevices] = useState([]);
  const [showWindow, setShowWindow] = useState(true);
  const [method, setMethod] = useState(null);

  const navbarToggle = () => setExpanded(!expanded);

  useEffect(() => {
    const fetchDevices = async () => {
      const deviceRes = await axios.get(`${apiUrl}/devices`, {
        withCredentials: true
      });
      setDevices(deviceRes.data);
    };
    fetchDevices();
  }, []);


  if (Object.keys(devices).length === 0) {
    return <>
      <div className="loading-container">
        <div className="loading-circle"></div>
        <img className="backgroundBlock" src="/images/power.jpg" />
        <div className="backgroundBlock"></div>
      </div>
    </>;
  };

  const showPage = (page) => {
    window.location.href = window.location.href.replace(/\/[^/]*$/, "") + "/energywatch";
  };

  const addDevice = () => {
    setShowWindow(true)
    setMethod("add")
  };
  const changeDevice = () => {
    setShowWindow(true)
    setMethod("change")
  };
  const removeDevice = () => {
    setShowWindow(true)
    setMethod("remove")
  };

  return (<>
    {/* Header */}
    <Navbar
      style={{
        backgroundColor: "rgb(0, 34, 102)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 100,
      }}
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={navbarToggle}
    >
      <Container>
        <Navbar.Brand onClick={() => showPage("power")} style={{ cursor: "pointer" }}>
          <img style={{ height: "40px" }} src="/images/new1.png" alt="EnergyWatch Logo" />
          &nbsp;EnergyWatch
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="navBarButton" />
        <Navbar.Collapse id="navbar-nav" className="ms-lg-5">
          <Nav className="me-auto">
            <Nav.Link onClick={() => showPage("power")} style={{ color: "white" }}>
              Power & Temperature
            </Nav.Link>
            <Nav.Link onClick={() => showPage("savings")} style={{ color: "white" }} className="ms-lg-2">
              Savings
            </Nav.Link>
            <Nav.Link onClick={() => showPage("scheduele")} style={{ color: "white" }} className="ms-lg-2">
              Prices & Schedules
            </Nav.Link>
            <NavDropdown className="custom-dropdown" title="More" id="nav-dropdown" style={{ color: "white" }}>
              <NavDropdown.Item style={{ backgroundColor: "#002266", color: "white" }} onClick={() => showPowerHourFunc()}>
                Set power hours
              </NavDropdown.Item>
              <NavDropdown.Item style={{ backgroundColor: "#002266", color: "white" }} onClick={() => showPage("control")}>
                Control Panel
              </NavDropdown.Item>
              <NavDropdown.Item className="mt-2" style={{ backgroundColor: "#002266", color: "white" }} onClick={() => handleLogout()}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <img className="backgroundBlock" src="/images/power.jpg" />
    <div className="backgroundBlock"></div>

    <Container className="mt-4 container-fluid savings pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col md={10} lg={8} className="p-0">
          <Container className="p-0">
            <h3 className="title mt-3">Control Panel</h3>
            <Row className="mt-4">

              <h4>Devices</h4>

              <Row>
                <Col xl={3}>
                  <h5 style={{cursor: "pointer"}} className="mt-4" onClick={addDevice}><i className="fa fa-plus"></i>&nbsp;&nbsp;Add device</h5>
                </Col>
                <Col xl={4}>
                  <h5 style={{cursor: "pointer"}} className="mt-4" onClick={changeDevice}><i className="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Change device</h5>
                </Col>
                <Col xl={3}>
                  <h5 style={{cursor: "pointer"}} className="mt-4" onClick={removeDevice}><i className="fa-solid fa-xmark"></i>&nbsp;&nbsp;Remove device</h5>
                </Col>
              </Row>

              <Row className="mt-4 mb-2">
                <Col><b>Device name</b></Col>
                <Col><b>Display name</b></Col>
                <Col><b>Id</b></Col>
                <Col><b>Wattformat</b></Col>
                <Col><b>Device type</b></Col>
              </Row>
              {Object.entries(devices).map(([key, value], index) => (
                <Row key={key} className="pt-2 pb-2" style={{borderTop: "1px solid white", borderLeft: "1px solid white", borderRight: "1px solid white", borderBottom: index === Object.entries(devices).length - 1 ? "1px solid white" : 0 }}>
                  <Col>{key}</Col>
                  <Col>{value.displayName}</Col>
                  <Col>{value.id}</Col>
                  <Col>{value.wattFormat}</Col>
                  <Col>{value.wattFormat ? "Relay" : "Thermometer"}</Col>
                </Row>
              ))}


              <Col>
              </Col>
            </Row>
            <Container className="savingsChartContainer p-0 m-0">
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
    <main>
      {showWindow && <PopUp showWindow={setShowWindow} method={method} devices={devices} />}
    </main>
  </>
  );
};
export default ControlPanel;